const db = require('../../modules'),
    data = require('../../data'),
    devs = data.devs,
    staff = data.staff,
    kpd = data.kpd,
    logger = data.logger;
module.exports = {
    name: 'ban',
    cooldown: 0,
    aliases: ['ban'],
    description: 'A command made for staff/kpd to ban users from using the bot',
    expectedArgs: 'k/ban (ID / @user)',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || kpd.includes(message.author.id))) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        if (devs.includes(target.id) || staff.includes(target.id)) return message.reply('You cannot ban devs/bot staff');
        if (target.id == message.author.id) return message.reply('You can\'t ban yourself bro');
        if (await db.utils.banned(target.id) == true) message.reply(`\`${target.username}\` is already banned`);
        await db.utils.ban(target.id);
        message.channel.send(`Successfully banned \`${target.username}\``);
        logger.commandsLog(message.author, 'banned', `**${message.author.tag}** banned **${target.tag}**`, message.guild, args.join(' '), 'Action : ban');
    },
};
