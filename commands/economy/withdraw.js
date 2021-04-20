const data = require('../../data');
module.exports = {
    name: 'with',
    aliases: ['withdraw'],
    execute: async(message, args) => {
        const { wallet , bank } = await data.economy.balance(message.author.id)
        if (bank <= 0) return message.reply('What are you withdrawing? lmao');
        if (!args[1]) return message.reply('What are you withdrawing nerd?');
        if (args[1].toLowerCase() === 'all') {
            await data.economy.withdraw(message.author.id , bank)
            message.reply(`Withdrawn ${data.emotes.kr}${bankbal}`);
            return;
        }
        if (bank < 0) return message.reply(`You don\'t have any ${data.emotes.kr} in your bank. lmfao`);
        if (isNaN(args[1])) return message.reply(`Sorry fam you can only withdraw actual KR ${data.emotes.kr}`);
        if (args[1] <= 0) return message.reply('What are you doing? Provide an actual number');
        if (args[1] > bank) return message.reply('What are you doing? you don\'t have that much kr');
        await data.economy.withdraw(message.author.id , args[1])
        message.reply(`Withdrew ${data.emotes.kr}${args[1]} , current bank balance is ${data.emotes.kr}${bank}`);
    },
};
