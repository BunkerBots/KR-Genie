import { MessageEmbed } from 'discord.js';
import { core } from '../../data/index.js';


export default {
    name: 'info',
    aliases: ['information', 'botinfo'],
    cooldown: 5,
    description: 'Shows the general information regarding the bot',
    expectedArgs: 'k/info',
    execute: async(message, args, bot) => {
        const userCount = bot.guilds.cache.reduce((a, g) => {
            return a + g.memberCount;
        }, 0);
        const embed = new MessageEmbed()
            .setColor(core.embed)
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`${bot.user.username} Info`)
            .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
            .addField('Version:', `\`${core.version}\``, true)
            .addField('Prefix:', `\`${core.prefix}\``, true)
            .addField('Bot Programmers:', `[EJ BEAN](${core.git.ej}), [JJ_G4M3R](${core.git.jj}), [Jytesh](${core.git.jytesh})`, true)
            .addField('Server Count:', `\`${bot.guilds.cache.size}\``, true)
            .addField('User Count:', `\`${userCount}\``, true)
            .addField('Language:', 'Javascript', true)
            .addField('Support Server:', '[Join Here](https://discord.gg/DfhQDQ8e8c)', true)
            .addField('Bot Repository:', `[Click Here](${core.git['KR-genie']})`, true)
            .addField('\u200b', '\u200b', true);
        message.reply(embed);
    },
};
