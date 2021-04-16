const { MessageEmbed } = require('discord.js');
const data = require('../../data/');
module.exports = {
    name: 'bal',
    execute: async(message, args) => {
        if (!args[1]) {
            const KR = await data.economy.balance(message.author.id);
            const KRbank = await data.economy.bankBalance(message.author.id);
            message.reply(new MessageEmbed()
                .setAuthor(`${message.author.username}'s balance`, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`**Wallet:** ${data.emotes.kr} ${KR}\n**Bank:** ${data.emotes.kr} ${KRbank}`)
                .setTimestamp()
                .setFooter('stonks'));
            return;
        }
        const target = message.client.users.fetch(args[1].replace(/\D/g, ''));
        try {
            await target;
        } catch (e) {
            message.channel.send('Unknown user');
        }
        target.then(async user => {
            const KR = await data.economy.balance(user.id);
            const KRbank = await data.economy.bankBalance(user.id);
            message.reply(new MessageEmbed()
                .setAuthor(`${user.username}'s balance`, user.displayAvatarURL({ dynamic: false }))
                .setDescription(`**Wallet:** ${data.emotes.kr} ${KR}\n**Bank:** ${data.emotes.kr} ${KRbank}`)
                .setTimestamp()
                .setFooter('stonks'));
        });
    },
};
