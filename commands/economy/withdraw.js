const dependencies = require('../../data/dependencies')
module.exports = {
    name: 'with',
    execute: async (message,args) => {
        const bankbal = await dependencies.economy.bankBalance(message.author.id)
        if (bankbal <= 0) return message.reply('What are you withdrawing? lmao')
        if (!args[1]) return message.reply('What are you withdrawing nerd?')
        if (args[1].toLowerCase() === 'all'){
            await dependencies.economy.addKR(message.author.id , bankbal)
            await dependencies.economy.deposit(message.author.id , -bankbal)
            message.reply(`Withdrawn ${dependencies.emotes.kr}${bankbal}`)
            return;
        }
        if (bankbal < 0) return message.reply('What are you withdrawing? lmao')
        if (isNaN(args[1])) return message.reply(`Sorry fam you can only withdraw actual KR ${dependencies.emotes.kr}`)
        if (args[1] <= 0) return message.reply(`What are you doing? Provide an actual number`)
        if (args[1] > bankbal) return message.reply('What are you doing? you don\'t have that much kr')
        await dependencies.economy.addKR(message.author.id , args[1])
        const addKR = await dependencies.economy.deposit(message.author.id , -args[1])
        message.reply(`Withdrew ${dependencies.emotes.kr}${args[1]} , current bank balance is ${dependencies.emotes.kr}${addKR}`)

    }
}