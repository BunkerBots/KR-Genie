const { MessageEmbed } = require('discord.js');
const core = require('../../data/JSON/core.json');
module.exports = {
    name: 'help',
    aliases: [],
    execute: async(message, args, bot) => {
        if (!args[0]) {
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle('Help Window')
                .setDescription('To get help on a specific module, type `k/help [command]` in the chat')
                .addField('Bot Prefix', '`k/`')
                .addField('Account Modules', '```md\n1. profile\n2. inventory\n3. skins\n4. collection\n5. status\n6. notifications```')
                .addField('Economy Modules', '```md\n1. balance\n2. beg\n3. bet\n4. bulkspin\n5. crime\n6. deposit\n7. give\n8. lb\n9. rob\n10. slots\n11. spin\n12. withdraw\n13. work```')
                .addField('Market Modules', '```md\n1. shop\n2. collectables\n3. buy```')
                .addField('Miscallaneous Modules', '```md\n1. infect\n2. cure\n3. daily```');
            message.reply(embed);
            return;
        }
        const commandName = args[0].toLowerCase();
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return message.reply('No such module found');
        const embed = new MessageEmbed()
            .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
            .setTitle(`Module Help Window: ${command.name}`)
            .setColor(core.embed)
            .setDescription(`**Description**\n${command.description}`)
            .addField('Command Aliases', `${command.aliases}`.replace(/,/g, ', '))
            .addField('Expected Usage', `\`${command.expectedArgs}\``)
            .addField('Cooldown', `${command.cooldown}s`)
            .setFooter('syntax: (required), [optional]');
        message.reply(embed);
    },
};
