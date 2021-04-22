const { MessageEmbed } = require('discord.js');
const data = require('../../data/');
const db = require('../../modules');

module.exports = {
    name: 'bal',
    aliases: ['balance'],
    execute: async(message, args) => {
        if (!args[1]) {
            const { wallet, bank } = await db.utils.balance(message.author.id);
            message.reply(new MessageEmbed()
                .setAuthor(`${message.author.username}'s balance`, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`**Wallet:** ${data.emotes.kr} ${wallet}\n**Bank:** ${data.emotes.kr} ${bank}\n**Net:** ${data.emotes.kr} ${wallet + bank}`)
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
            const { wallet, bank } = await db.utils.balance(user.id);
            message.reply(new MessageEmbed()
                .setAuthor(`${user.username}'s balance`, user.displayAvatarURL({ dynamic: false }))
                .setDescription(`**Wallet:** ${data.emotes.kr} ${wallet}\n**Bank:** ${data.emotes.kr} ${bank}\n**Net:** ${data.emotes.kr} ${wallet + bank}`)
                .setTimestamp()
                .setFooter('stonks'));
        });
    },
};
