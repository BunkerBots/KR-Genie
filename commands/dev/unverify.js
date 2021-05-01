const db = require('../../modules'),
    data = require('../../data'),
    devs = data.devs,
    staff = data.staff,
    logger = require('./modules/logger.js');
module.exports = {
    name: 'unverify',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id))) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        await db.utils.unverify(target.id);
        message.channel.send(`Successfully unverified \`${target.username}\``);
        logger.commandsLog(message.author, 'unverify', `**${message.author.tag}** unverified **${target.tag}**`, message.guild, args.join(' '), 'Badge: revoked verification');
    },
};
