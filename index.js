const { Client, Collection, MessageEmbed } = require('discord.js'),
    core = require('./JSON/core.json'),
    mongoose = require('mongoose'),
    id = require('./JSON/id.json'),
    logger = require('./scripts/logger.js'),
    bot = new Client({ disableMentions: 'everyone' }),
    fs = require('fs'),
    dev = require('./JSON/dev.json'),
    cooldowns = new Collection(),
    dependencies = require('./data/dependencies');
require('dotenv').config()
bot.commands = new Collection();
const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`)
        bot.commands.set(command.name, command);
    }
}

bot.on('ready', async () => {
    module.exports.bot = bot;
    logger.debug('index.js', 'Logging in');
    logger.info('Ready!');
    bot.user.setPresence({
        activity: {
            name: `KR fly by`,
            type: 'WATCHING'
        },
        status: 'idle'
    })
    await logger.init(bot);
    process.on('unhandledRejection', logger.unhandledError);

    mongoose.connect(config.mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => {
        logger.info('Connected to mongoDB!')
    })
    console.log(`Logged in as ${bot.user.username}`)
    //console.log(config.mongoPath)
    bot.channels.resolve(id.channels.logs).send(new MessageEmbed()
        .setDescription(`\`\`\`diff\n+ Logged in as ${bot.user.username}\n- Version : ${core.version}\`\`\`\nDatabase: MongoDB\nstatus: connected <a:check:827647433445474314>`)
        .setTimestamp()).catch(console.error)
    process.on('SIGTERM', () => {
        bot.user.setPresence({
            activity: {
                name: 'SHUTTING DOWN',
                type: 'WATCHING',
            },
            status: 'dnd',
        }).then(() => {
            logger.info('SHUT DOWN!');
            process.exit(0);
        }).catch(() => {
            logger.info('SHUTTING DOWN WITHOUT PRESENCE!');
            process.exit(0);
        });
    });
})

let maintanence = false;
bot.on('message', async message => {
    const args = message.content.substring(core.prefix.length).split(" ");
    const cmd = args[0].toLowerCase()
    switch (cmd) {
        case 'maintenance':
            if (!dependencies.developers.developers.includes(message.author.id)) return;
            if (!args[1]) return;
            if (args[1] === 'on') {
                maintanence = true
            } else {
                maintanence = false
            }
            message.channel.send(`maintenance mode ${maintanence ? 'enabled' : 'disabled'}`)
            break;
    }
})

bot.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(core.prefix)) return;
    const args = message.content.substring(core.prefix.length).trim().split(" "),
        commandName = args[0].toLowerCase();
    const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandname));
    if (!command) return;
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (!dependencies.developers.developers.includes(message.author.id)) {
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                const time = timeLeft / 60
                return message.reply(new MessageEmbed()
                    .setColor('YELLOW')
                    .setTitle('Whoa whoa hold on...')
                    .setDescription(`You need to wait \`${time.toFixed(1)}\` more minute(s) before reusing the \`${command.name}\` command.`)
                    .setFooter('notstonks4u'));
            }
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    if (maintanence === false) {
        try {
            command.execute(message, args)
        } catch (error) {
            console.log(error)
        }
    } else {
        message.channel.send(new MessageEmbed()
            .setDescription(`\`\`\`diff\n- The bot commands are disabled for maintenance , please try again later\`\`\` \n<a:tools:830536514303295518> [Join our support server](https://discord.gg/DfhQDQ8e8c)`)).catch(e => console.log(e))
        return;
    }

})

bot.login(process.env.TOKEN)