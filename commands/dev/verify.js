const db = require('../../modules'),
    data = require('../../data'),
    devs = data.devs,
    staff = data.staff,
    logger = require('../../modules/logger');
module.exports = {
    name: 'verify',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id))) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        await db.utils.verify(target.id);
        message.channel.send(`Successfully verified \`${target.username}\``);
        logger.commandsLog(message.author, 'verify', `**${message.author.tag}** verified **${target.tag}**`, message.guild, args.join(' '), 'Badge: verification');
    },
};
