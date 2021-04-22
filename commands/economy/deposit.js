const data = require('../../data');
const db = require('../../modules');

module.exports = {
    name: 'dep',
    aliases: ['deposit'],
    execute: async(message, args) => {
        const { wallet } = await db.utils.balance(message.author.id);
        if (wallet <= 0) return message.reply('Fam you cant deposit thin air');
        if (!args[1]) return message.reply('What are you depositing nerd?');
        if (args[1].toLowerCase() === 'all') {
            await db.utils.deposit(message.author.id, wallet);
            message.reply(`Deposited ${data.emotes.kr}${wallet}`);
            return;
        }

        if (isNaN(args[1])) return message.reply('Sorry fam you can only deposit actual KR');
        const deposit = parseInt(args[1]);
        if (deposit <= 0) return message.reply('What are you doing? Provide an actual number');
        if (deposit > wallet) return message.reply('What are you doing? you don\'t have that much kr');

        const depbal = await db.utils.deposit(message.author.id, deposit);
        message.reply(`Deposited ${data.emotes.kr}${deposit} , current bank balance is ${data.emotes.kr}${depbal}`);
    },
};
