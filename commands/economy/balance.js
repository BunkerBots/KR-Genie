const { MessageEmbed } = require('discord.js')
const dependencies = require('../../data/dependencies')
module.exports = {
    name: 'bal',
    execute: async (message , args) => {
        if (!args[1]) {
            const KR = await dependencies.economy.balance(message.author.id)
            const KRbank = await dependencies.economy.bankBalance(message.author.id)
            message.reply(new MessageEmbed()
                .setAuthor(`${message.author.username}'s balance`, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`**Wallet:** ${dependencies.emotes.kr} ${KR}\n**Bank:** ${dependencies.emotes.kr} ${KRbank}`)
                .setTimestamp()
                .setFooter('stonks'))
                return;
        }
        const target = message.client.users.fetch(args[1].replace(/\D/g, ''));
        try {
            await target
        } catch (e) {
            message.channel.send('Unknown user')
        }
        target.then(async user => {
            const KR = await dependencies.economy.balance(user.id)
            const KRbank = await dependencies.economy.bankBalance(user.id)
            message.reply(new MessageEmbed()
                .setAuthor(`${user.username}'s balance`, user.displayAvatarURL({ dynamic: false }))
                .setDescription(`**Wallet:** ${dependencies.emotes.kr} ${KR}\n**Bank:** ${dependencies.emotes.kr} ${KRbank}`)
                .setTimestamp()
                .setFooter('stonks'))
        })

    }
}