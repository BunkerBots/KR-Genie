const { MessageEmbed } = require('discord.js');
const dependencies = require('../../data/dependencies')
module.exports = {
    name: 'bet',
    cooldown: 10,
    execute: async (message , args) => {
        const wallet = await dependencies.economy.balance(message.author.id)
        if (!args[1]) return message.reply('What are you betting nerd?')
        if (args[1].toLowerCase() === 'all'){
            if (wallet <= 0) return message.reply(`You do not have any ${dependencies.emotes.kr} in your wallet`)
        const res = Math.floor(Math.random() * 2)
        if (res === 1) {
            await dependencies.economy.addKR(message.author.id, wallet)
            message.reply(new MessageEmbed()
                .setColor('GREEN')
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`Lucky ducky , you won the bet! ${dependencies.emotes.kr}${wallet}`)
                .setFooter('stonks4u'))
        } else {
            await dependencies.economy.addKR(message.author.id, -wallet)
            message.reply(new MessageEmbed()
                .setColor('RED')
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`LMAO you lost the bet!`)
                .setFooter('sucks to suck'))

        }

            return;
        }
        if (isNaN(args[1])) return message.reply('What do I look like to you? Provide a valid amount to bet')
        
        if (wallet < args[1]) return message.reply(`You do not have ${args[1]} in your wallet`)
        if (args[1] <= 0) return message.reply('How about you try to provide an actual number?')
        const res = Math.floor(Math.random() * 2)
        if (res == 1) {
            await dependencies.economy.addKR(message.author.id, args[1])
            message.reply(new MessageEmbed()
                .setColor('GREEN')
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`Lucky ducky , you won the bet! ${dependencies.emotes.kr}${args[1]}`)
                .setFooter('stonks4u'))
        } else {
            await dependencies.economy.addKR(message.author.id, -args[1])
            message.reply(new MessageEmbed()
                .setColor('RED')
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`LMAO you lost the bet!`)
                .setFooter('sucks to suck'))

        }
    }
}