const data = require('../../data');
module.exports = {
    name: 'with',
    aliases: ['withdraw'],
    execute: async(message, args) => {
        const bankbal = await data.economy.bankBalance(message.author.id);
        if (bankbal <= 0) return message.reply('What are you withdrawing? lmao');
        if (!args[1]) return message.reply('What are you withdrawing nerd?');
        if (args[1].toLowerCase() === 'all') {
            await data.economy.addKR(message.author.id, bankbal);
            await data.economy.deposit(message.author.id, -bankbal);
            message.reply(`Withdrawn ${data.emotes.kr}${bankbal}`);
            return;
        }
        if (bankbal < 0) return message.reply('What are you withdrawing? lmao');
        if (isNaN(args[1])) return message.reply(`Sorry fam you can only withdraw actual KR ${data.emotes.kr}`);
        if (args[1] <= 0) return message.reply('What are you doing? Provide an actual number');
        if (args[1] > bankbal) return message.reply('What are you doing? you don\'t have that much kr');
        await data.economy.addKR(message.author.id, args[1]);
        const addKR = await data.economy.deposit(message.author.id, -args[1]);
        message.reply(`Withdrew ${data.emotes.kr}${args[1]} , current bank balance is ${data.emotes.kr}${addKR}`);
    },
};
