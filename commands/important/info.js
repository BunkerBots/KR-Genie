const { MessageEmbed } = require('discord.js'),
    core = require('../../data').core;

module.exports = {
    name: 'info',
    aliases: ['information', 'botinfo'],
    cooldown: 5,
    description: 'Shows the general information regarding the bot',
    expectedArgs: 'k/info',
    execute: async(message, args, bot) => {
        const embed = new MessageEmbed()
            .setColor(core.embed)
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
            .setTitle(`${bot.user.username} Info`)
            .addField('Version:', `\`${core.version}\``, true)
            .addField('Prefix:', `\`${core.prefix}\``, true)
            .addField('Bot Programmers:', 'EJ BEAN, JJ_G4M3R, Jytesh', true)
            .addField('Server Count:', `${bot.guilds.cache.size}`, true)
            .addField('User Count:', `${bot.users.cache.size}`, true)
            .addField('Language:', 'Javascript', true)
            .addField('Support Server:', '[Join Here](https://discord.gg/DfhQDQ8e8c)', true)
            .addField('Bot Repository', '[Click Here](https://github.com/BunkerBots/KR-Genie)', true)
            .addField('\u200b', '\u200b', true);
        message.reply(embed);
    },
};
