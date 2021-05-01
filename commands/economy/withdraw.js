const data = require('../../data'),
    logger = require('./modules/logger.js'),
    db = require('../../modules'),
    comma = require('../../modules/comma'),
    utils = require('../../modules/messageUtils');

module.exports = {
    name: 'withdraw',
    aliases: ['with'],
    cooldown: 5,
    description: `Withdraw ${data.emotes.kr} from bank to your wallet. Beware of robbers`,
    expectedArgs: 'k/withdraw (amount)',
    execute: async(message, args) => {
        const balance = await db.utils.balance(message.author.id);
        const { bank } = await db.utils.balance(message.author.id);
        if (!args[0]) return message.reply(await utils.createEmbed(message.author, 'RED', 'What are you withdrawing nerd?'));
        const KRtowithdraw = parseInt(utils.parseBank(args[0], balance));
        if (bank < 0) return message.reply(await utils.createEmbed(message.author, 'RED', `You don't have any ${data.emotes.kr} in your bank. lmfao`));
        if (!Number.isInteger(KRtowithdraw)) return message.reply(await utils.createEmbed(message.author, 'RED', `Sorry fam you can only withdraw whole numbers ${data.emotes.kr}`));
        if (KRtowithdraw <= 0) return message.reply(await utils.createEmbed(message.author, 'RED', 'lol you need to actually provide a valid number..'));
        if (KRtowithdraw > bank) return message.reply(await utils.createEmbed(message.author, 'RED', `What are you doing? you don't have ${data.emotes.kr}${KRtowithdraw} in your bank`));
        const wtihbal = await db.utils.withdraw(message.author.id, KRtowithdraw);
        const withEmbed = await utils.createEmbed(message.author, 'GREEN', `Withdrew ${data.emotes.kr}${comma(KRtowithdraw)} , current bank balance is ${data.emotes.kr}${comma(wtihbal)}`);
        message.reply(withEmbed);
        logger.commandsLog(message.author, 'withdraw', `**${message.author.tag}** withdrew **${data.emotes.kr}${KRtowithdraw}** from their bank`, message.guild, args.join(' '), `KR: ${KRtowithdraw}`);
    },
};
