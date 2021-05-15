import { MessageEmbed } from 'discord.js';
import * as core from '../../data/JSON/core.json';import { createEmbed } from '../../modules/messageUtils';


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
                .addField('Account Modules', '```md\n1. profile\n2. status\n3. notifications\n\u200b```', true)
                .addField('Inventory Modules', '```md\n1. inventory\n2. collection\n3. skins\n\u200b```', true)
                .addField('Game modules', '```md\n1. slots\n2. blackjack\n3. roulette\n4. duel```', true)
                .addField('Economy Modules', '```md\n1. balance\n2. beg\n3. bet\n4. bulkspin\n5. bulkshop\n6. bulksell```', true)
                .addField('\u200b', '```md\n7. crime\n8. deposit\n9. give\n10. item\n11. lb\n12. rob```', true)
                .addField('\u200b', '```md\n\n13. sell\n14. spin\n15. withdraw\n16. work\n\u200b\n\u200b```', true)
                .addField('Market Modules', '```md\n1. shop\n2. collect\n3. buy```', true)
                .addField('Miscallaneous Modules', '```md\n1. infect\n2. cure\n3. daily```', true)
                .addField('\u200b', '\u200b', true)
                .setTimestamp();
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
