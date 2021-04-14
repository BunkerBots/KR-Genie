const economy = require('../../scripts/economy');
const response = require('./JSON/work.json'),
emotes = require('../../JSON/emotes.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'dep',
    execute: async (message,args) => {
        const walletbal = await economy.balance(message.author.id)
        if (walletbal <= 0) return message.reply('Fam you cant deposit thin air')
        if (!args[1]) return message.reply('What are you depositing nerd?')
        if (args[1].toLowerCase() === 'all'){
            await economy.deposit(message.author.id , walletbal)
            await economy.addKR(message.author.id , -walletbal)
            message.reply(`Deposited ${emotes.kr}${walletbal}`)
            return;
        }

        if (isNaN(args[1])) return message.reply('Sorry fam you can only deposit actual KR')
        if (args[1] <= 0) return message.reply(`What are you doing? Provide an actual number`)
        if (args[1] > walletbal) return message.reply('What are you doing? you don\'t have that much kr')
        
        const depbal = await economy.deposit(message.author.id , args[1])
        const addKR = await economy.addKR(message.author.id , -args[1])
        message.reply(`Deposited ${emotes.kr}${args[1]} , current bank balance is ${emotes.kr}${depbal}`)
    }
}