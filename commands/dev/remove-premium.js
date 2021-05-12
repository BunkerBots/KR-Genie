const db = require('../../modules'),
    data = require('../../data'),
    devs = data.devs,
    staff = data.staff,
    logger = require('../../modules/logger'),
    { createEmbed } = require('../../modules/messageUtils');
module.exports = {
    name: 'removepremium',
    aliases: ['delprem'],
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id))) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        await db.utils.removePremium(target.id);
        message.channel.send(createEmbed(message.author, 'GREEN', `Successfully removed premium from \`${target.username}\``));
        logger.commandsLog(message.author, 'removepremium', `**${message.author.tag}** removed premium **${target.tag}**`, message.guild, args.join(' '), 'Badge: premium');
    },
};
