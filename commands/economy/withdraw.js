const data = require('../../data'),
    logger = data.logger,
    db = require('../../modules');

module.exports = {
    name: 'with',
    aliases: ['withdraw'],
    cooldown: 5,
    execute: async(message, args) => {
        let KRtowithdraw;
        const { bank } = await db.utils.balance(message.author.id);
        if (bank <= 0) return message.reply(`You do not have any ${data.emotes.kr} in your bank!`);
        if (!args[0]) return message.reply('What are you withdrawing nerd?');
        if (args[0].toLowerCase() === 'all') KRtowithdraw = parseInt(bank);
        else if (args[0].toLowerCase() === 'half') KRtowithdraw = parseInt(bank / 2);
        else if (args[0].toLowerCase() === 'quarter') KRtowithdraw = parseInt(bank / 4);
        else KRtowithdraw = parseInt(args[0]);
        if (bank < 0) return message.reply(`You don't have any ${data.emotes.kr} in your bank. lmfao`);
        if (!Number.isInteger(KRtowithdraw)) return message.reply(`Sorry fam you can only withdraw whole numbers ${data.emotes.kr}`);
        if (KRtowithdraw <= 0) return message.reply('lol you need to actually provide a valid number..');
        if (KRtowithdraw > bank) return message.reply(`What are you doing? you don't have ${data.emotes.kr}${KRtowithdraw} in your bank`);
        const wtihbal = await db.utils.withdraw(message.author.id, KRtowithdraw);
        message.reply(`Withdrew ${data.emotes.kr}${KRtowithdraw} , current bank balance is ${data.emotes.kr}${wtihbal}`);
        logger.commandsLog(message.author, 'withdraw', `**${message.author.tag}** withdrew **${data.emotes.kr}${KRtowithdraw}** from their bank`, message.guild, args.join(' '), `KR: ${KRtowithdraw}`);
    },
};
