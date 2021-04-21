const data = require('../../data');
module.exports = {
    name: 'with',
    aliases: ['withdraw'],
    execute: async(message, args) => {
        const { wallet, bank } = await data.economy.balance(message.author.id);
        if (bank <= 0) return message.reply(`You do not have any ${data.emotes.kr} in your bank!`);
        if (!args[1]) return message.reply('What are you withdrawing nerd?');
        if (args[1].toLowerCase() === 'all') {
            await data.economy.withdraw(message.author.id, parseInt(bank));
            message.reply(`Withdrawn ${data.emotes.kr}${parseInt(bank)}`);
            return;
        }
        const KRtowithdraw = parseInt(args[1]);
        if (bank < 0) return message.reply(`You don't have any ${data.emotes.kr} in your bank. lmfao`);
        if (!Number.isInteger(KRtowithdraw)) return message.reply(`Sorry fam you can only withdraw whole numbers ${data.emotes.kr}`);
        if (KRtowithdraw <= 0) return message.reply(`You do not have any ${data.emotes.kr} in your bank!`);
        if (KRtowithdraw > bank) return message.reply(`What are you doing? you don't have ${data.emotes.kr}${KRtowithdraw} in your bank`);
        const wtihbal = await data.economy.withdraw(message.author.id, KRtowithdraw);
        message.reply(`Withdrew ${data.emotes.kr}${KRtowithdraw} , current bank balance is ${data.emotes.kr}${wtihbal}`);
    },
};
