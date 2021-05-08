const { MessageEmbed } = require('discord.js');
const core = require('../../data/JSON/core.json'),
    { createEmbed } = require('../../modules/messageUtils');
module.exports = {
    name: 'help',
    aliases: [],
    execute: async(message, args, bot) => {
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('Help Window')
                .setColor(core.embed)
                .setDescription('To get help on a specific module, type `k/help [command]` in the chat')
                .addField('Bot Prefix', `\`${core.prefix}\``)
                .addField('Account Modules', '```md\n1. profile\n2. status\n3. notifications```', true)
                .addField('Inventory Modules', '```md\n1. inventory\n2. collection\n3. skins```', true)
                .addField('\u200b', '\u200b', true)
                .addField('Economy Modules', '```md\n1. balance\n2. beg\n3. bet\n4. bulkspin\n5. bulkshop\n6. bulksell\n7. crime\n8. deposit\n9. duel```', true)
                .addField('\u200b', '```md\n10. give\n11. item\n12. lb\n13. rob\n14. sell\n15. slots\n16. spin\n17. withdraw\n18. work```', true)
                .addField('\u200b', '\u200b', true)
                .addField('Market Modules', '```md\n1. shop\n2. collectables\n3. buy```', true)
                .addField('Miscallaneous Modules', '```md\n1. infect\n2. cure\n3. daily```', true)
                .addField('\u200b', '\u200b', true);
            message.reply(embed);
            return;
        }
        const commandName = args[0].toLowerCase();
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.reply(createEmbed(message.author, 'RED', 'No such module found'));
        if (command.dev == true) return;
        const embed = new MessageEmbed()
            .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`Module Help Window: ${command.name}`)
            .setColor(core.embed)
            .setDescription(`**Description**\n${command.description || 'No description found'}`)
            .addField('Command Aliases', `${command.aliases || 'No aliases found'}`.replace(/,/g, ', '))
            .addField('Expected Usage', `\`${command.expectedArgs}\``)
            .addField('Cooldown', `${command.cooldown || 0}s`)
            .setFooter('syntax: (required), [optional]');
        message.reply(embed);
    },
};
