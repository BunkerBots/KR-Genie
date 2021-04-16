const { MessageEmbed } = require('discord.js')
const dependencies = require('../../data/dependencies')
module.exports = {
    name: 'give',
    aliases: ['pay', 'share'],
    execute: async (message, args) => {
        if (!args[1]) return message.channel.send(`Who are you giving ${dependencies.emotes.kr} to?`)
        const target = message.guild.members.fetch(args[1].replace(/\D/g, ''));
        try {
            await target
        } catch (e) {
            message.channel.send('Unknown user')
        }
        const walletbal = await dependencies.economy.balance(message.author.id)
        if (walletbal <= 0) return message.channel.send(`You do not have enough ${dependencies.emotes.kr}`)
        if (walletbal < args[2]) return message.channel.send(`You do not have ${dependencies.emotes.kr}${args[2]}`)
        target.then(async user => {
        if (args[2].toLowerCase() === 'all'){
            await dependencies.economy.addKR(user.id , walletbal)
            await dependencies.economy.addKR(message.author.id , -walletbal)
            const authorallbal = await dependencies.economy.balance(message.author.id)
            const userallbal = await dependencies.economy.balance(user.id)
            message.reply(`You gave <@${user.id}> ${dependencies.emotes.kr}${walletbal} , now you have ${dependencies.emotes.kr}${authorallbal} and they've got ${dependencies.emotes.kr}${userallbal}.`)
            return;
        }
        if (isNaN(args[2])) return message.channel.send(`What are you doing? That's not even a valid number`)
        
            await dependencies.economy.addKR(user.id, args[2])
            await dependencies.economy.addKR(message.author.id, -args[2])
            const authorbal = await dependencies.economy.balance(message.author.id)
            const userbal = await dependencies.economy.balance(user.id)
            message.reply(`You gave <@${user.id}> ${dependencies.emotes.kr}${args[2]} , now you have ${dependencies.emotes.kr}${authorbal} and they've got ${dependencies.emotes.kr}${userbal}.`)
        })
    }
}