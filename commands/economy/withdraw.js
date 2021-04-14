const economy = require('../../scripts/economy');
const response = require('./JSON/search.json'),
emotes = require('../../JSON/emotes.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'with',
    execute: async (message,args) => {
        const bankbal = await economy.bankBalance(message.author.id)
        if (!args[1]) return message.reply('What are you depositing nerd?')
        if (isNaN(args[1])) return message.reply(`Sorry fam you can only deposit actual KR ${emotes.kr}`)
        if (args[1] > bankbal) return message.reply('What are you doing? you don\'t have that much kr')
        const walletbal = await economy.addKR(message.author.id , args[1])
        const addKR = await economy.deposit(message.author.id , -args[1])
        message.reply(`Withdrew ${emotes.kr}${args[1]} , current bank balance is ${emotes.kr}${addKR}`)
    }
}