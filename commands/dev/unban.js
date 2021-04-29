const db = require('../../modules'),
    data = require('../../data'),
    devs = data.devs,
    staff = data.staff,
    kpd = data.kpd,
    logger = data.logger;
module.exports = {
    name: 'unban',
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || kpd.includes(message.author.id))) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        if (devs.includes(target.id) || staff.includes(target.id)) return message.reply('You cannot use this command on devs/bot staff');
        if (await db.utils.banned(target.id) == false) return message.reply(`\`${target.username}\` is not banned`);
        await db.utils.unban(target.id);
        message.channel.send(`Successfully unbanned \`${target.username}\``);
        logger.commandsLog(message.author, 'unbanned', `**${message.author.tag}** unbanned **${target.tag}**`, message.guild, args.join(' '), 'Action : unban');
    },
};
