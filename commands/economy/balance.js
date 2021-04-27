const { MessageEmbed } = require('discord.js'),
    data = require('../../data/'),
    db = require('../../modules'),
    comma = require('../../modules/comma');

module.exports = {
    name: 'bal',
    aliases: ['balance'],
    execute: async(message, args) => {
        if (!args[0]) {
            const { wallet, bank } = await db.utils.balance(message.author.id);
            message.reply(new MessageEmbed()
                .setAuthor(`${message.author.username}'s balance`, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`**Wallet:** ${data.emotes.kr} ${comma(wallet)}\n**Bank:** ${data.emotes.kr} ${comma(bank)}\n**Net:** ${data.emotes.kr} ${comma(wallet + bank)}`)
                .setTimestamp()
                .setFooter('stonks'));
            return;
        }
        const user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user)
            return message.channel.send('Unknown user');
        const { wallet, bank } = await db.utils.balance(user.id);
        message.reply(new MessageEmbed()
            .setAuthor(`${user.username}'s balance`, user.displayAvatarURL({ dynamic: false }))
            .setDescription(`**Wallet:** ${data.emotes.kr} ${comma(wallet)}\n**Bank:** ${data.emotes.kr} ${comma(bank)}\n**Net:** ${data.emotes.kr} ${comma(wallet + bank)}`)
            .setTimestamp()
            .setFooter('stonks'));
    },
};
