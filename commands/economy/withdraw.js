const economy = require('../../scripts/economy');
const response = require('./JSON/work.json'),
emotes = require('../../JSON/emotes.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'with',
    execute: async (message,args) => {
        const bankbal = await economy.bankBalance(message.author.id)
        if (bankbal <= 0) return message.reply('What are you withdrawing? lmao')
        if (!args[1]) return message.reply('What are you withdrawing nerd?')
        if (args[1].toLowerCase() === 'all'){
            await economy.addKR(message.author.id , bankbal)
            await economy.deposit(message.author.id , -bankbal)
            message.reply(`Withdrawn ${emotes.kr}${bankbal}`)
            return;
        }
        if (bankbal < 0) return message.reply('What are you withdrawing? lmao')
        if (isNaN(args[1])) return message.reply(`Sorry fam you can only withdraw actual KR ${emotes.kr}`)
        if (args[1] <= 0) return message.reply(`What are you doing? Provide an actual number`)
        if (args[1] > bankbal) return message.reply('What are you doing? you don\'t have that much kr')
        const walletbal = await economy.addKR(message.author.id , args[1])
        const addKR = await economy.deposit(message.author.id , -args[1])
        message.reply(`Withdrew ${emotes.kr}${args[1]} , current bank balance is ${emotes.kr}${addKR}`)

    }
}