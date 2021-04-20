const data = require('../../data');
module.exports = {
    name: 'dep',
    aliases: ['deposit'],
    execute: async(message, args) => {
        const { wallet } = await data.economy.balance(message.author.id);
        if (wallet <= 0) return message.reply('Fam you cant deposit thin air');
        if (!args[1]) return message.reply('What are you depositing nerd?');
        if (args[1].toLowerCase() === 'all') {
            await data.economy.deposit(message.author.id, wallet);
            message.reply(`Deposited ${data.emotes.kr}${wallet}`);
            return;
        }

        if (isNaN(args[1])) return message.reply('Sorry fam you can only deposit actual KR');
        let KRtodeposit = parseInt(args[1]);
        if (KRtodeposit <= 0) return message.reply('What are you doing? Provide an actual number');
        if (KRtodeposit > wallet) return message.reply('What are you doing? you don\'t have that much kr');

        const depbal = await data.economy.deposit(message.author.id, KRtodeposit);
        message.reply(`Deposited ${data.emotes.kr}${KRtodeposit} , current bank balance is ${data.emotes.kr}${depbal}`);
    },
};