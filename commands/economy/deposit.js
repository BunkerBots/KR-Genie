const data = require('../../data');
const db = require('../../modules'),
    comma = require('../../modules/comma'),
    utils = require('../../modules/messageUtils');
module.exports = {
    name: 'dep',
    aliases: ['deposit'],
    execute: async(message, args) => {
        const { wallet } = await db.utils.balance(message.author.id);
        const balance = await db.utils.balance(message.author.id);
        if (wallet <= 0) return message.reply('Fam you cant deposit thin air');
        if (!args[0]) return message.reply('What are you depositing nerd?');
        const krtodeposit = parseInt(utils.parse(args[0], balance));
        if (!Number.isInteger(krtodeposit)) return message.reply('Sorry fam you can only deposit actual KR');
        if (krtodeposit <= 0) return message.reply('What are you doing? Provide an actual number');
        if (krtodeposit > wallet) return message.reply('What are you doing? you don\'t have that much kr');

        const depbal = await db.utils.deposit(message.author.id, krtodeposit);
        message.reply(`Deposited ${data.emotes.kr}${comma(krtodeposit)} , current bank balance is ${data.emotes.kr}${comma(depbal)}`);
    },
};
