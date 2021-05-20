const { Client, Collection, MessageEmbed, Intents } = require('discord.js'),
    bot = new Client({ disableMentions: 'everyone', ws: { intents } }),
    cooldowns = new Collection(),
    cron = require('node-cron'),
    data = require('./data'),
    db = require('./modules'),
    fs = require('fs'), { id, core } = data,
    intents = (new Intents).add(Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_EMOJIS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS),
    logger = require('./modules/logger.js');

let maintenance = false;

// Load commands
bot.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        bot.commands.set(command.name, command);
    }
}

// Login
require('dotenv').config();
bot.login(process.env.NODE_ENV == 'PRODUCTION' ? process.env.TOKEN : process.env.TEST_TOKEN);

// Ready
bot.on('ready', async() => {
    module.exports.bot = bot;

    logger.debug('index.js', 'Logging in');
    bot.user.setPresence({ activity: { name: 'KR fly by', type: 'WATCHING' }, status: 'online', });
    logger.info('Ready!');

    require('./modules/messageUtils').load(bot);
    await logger.init(bot);

    console.log(`Logged in as ${bot.user.username}`);

    bot.channels.resolve(id.channels.logs).send(new MessageEmbed()
        .setDescription(`\`\`\`diff\n+ Logged in as ${bot.user.username}\n- Version : ${core.version}\`\`\`\nDatabase: KeyvHQ-Redis, KeyvHQ-Mongo\nstatus: connected <a:check:827647433445474314>`)
        .setTimestamp()).catch(console.error);

    process.on('unhandledRejection', logger.unhandledError);
    process.on('SIGTERM', () => {
        bot.user.setPresence({
            activity: { name: 'SHUTTING DOWN', type: 'WATCHING' },
            status: 'dnd',
        }).then(() => {
            logger.info('SHUT DOWN!');
            process.exit(0);
        }).catch(() => {
            logger.info('SHUTTING DOWN WITHOUT PRESENCE!');
            process.exit(0);
        });
    });

    cron.schedule('30 14 * * *', () => { db.backup(await bot.channels.resolve(data.id.channels['backup-dump'])) }); // Every day at 2:30 PM
});

// onMessage Event
bot.on('message', async message => {
    /** Ignores:
     * - Bots
     * - Messages that don't start with bot prefix
     * - Banned users */
    if (message.author.bot || !message.content.toLowerCase().startsWith(core.prefix) || await db.utils.banned(message.author.id)) return;

    // Maintenance mode
    if (data.devs.includes(message.author.id) && message.content.startsWith(`${core.prefix}maintenance`) && message.content.split.length == 2) {
        maintenance = message.content.split(' ')[1] == 'on' ? true : false;
        if (maintenance) bot.user.setPresence({ activity: { name: 'the janitor', type: 'WATCHING' }, status: 'dnd' });
        else bot.user.setPresence({ activity: { name: 'KR fly by', type: 'WATCHING' }, status: 'online' });
        message.channel.send(`maintenance mode ${maintenance ? 'enabled' : 'disabled'}`);
    }

    const args = message.content.substring(core.prefix.length).trim().split(' '),
        commandName = args.shift().toLowerCase(),
        command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Collection());

    const now = Date.now(),
        timestamps = cooldowns.get(command.name),
        expirationTime = timestamps.get(message.author.id) + ((command.cooldown || 0) * 1000);

    if (!data.devs.includes(message.author.id) && timestamps.has(message.author.id)) {
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000,
                time = timeLeft / 60;
            let seconds;

            if (time.toFixed(0) < 1) seconds = `${timeLeft.toFixed(1)} second(s)`;
            else seconds = `${time.toFixed(1)} minute(s)`;

            return message.reply(new MessageEmbed()
                .setColor('YELLOW')
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle('Whoa whoa hold on...')
                .setDescription(`You need to wait \`${seconds}\` before reusing the \`${command.name}\` command.`)
                .setFooter('#no-stonks4u'));
        } else timestamps.delete(message.author.id);
    }

    if (!maintenance) {
        try {
            message.timestamps = timestamps;
            command.execute(message, args, bot);
            if (!command.manualStamp) timestamps.set(message.author.id, now);
        } catch (error) { console.log(error) }
    } else {
        message.channel.send(new MessageEmbed()
            .setDescription('```diff\n- The bot commands are disabled for maintenance , please try again later``` \n<a:tools:830536514303295518> [Join our support server](https://discord.gg/DfhQDQ8e8c)')
            .setColor('BLACK')
            .setURL('https://discord.gg/DfhQDQ8e8c')
        ).catch(e => console.log(e));
    }
});