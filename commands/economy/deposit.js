import data from '../../data/index.js';
import db from '../../modules/db.js';
import comma from '../../modules/comma.js';
import utils from '../../modules/messageUtils.js';

export default {
    name: 'deposit',
    cooldown: 2,
    aliases: ['dep'],
    description: `A command to deposit ${data.emotes.kr} from wallet to your bank. Use this to prevent getting robbed`,
    expectedArgs: 'k/deposit (amount)',
    execute: async(message, args) => {
        const { wallet } = await db.utils.balance(message.author.id);
        const balance = await db.utils.balance(message.author.id);
        if (wallet <= 0) return message.reply(utils.createEmbed(message.author, 'RED', 'Fam you cant deposit thin air'));
        if (!args[0]) return message.reply(utils.createEmbed(message.author, 'RED', 'What are you depositing nerd?'));
        const krtodeposit = parseInt(utils.parse(args[0], balance));
        if (!Number.isInteger(krtodeposit)) return message.reply(utils.createEmbed(message.author, 'RED', 'Sorry fam you can only deposit actual KR'));
        if (krtodeposit <= 0) return message.reply(utils.createEmbed(message.author, 'RED', 'What are you doing? Provide an actual number'));
        if (krtodeposit > wallet) return message.reply(utils.createEmbed(message.author, 'RED', 'Bro you don\'t have that much kr'));

        const depbal = await db.utils.deposit(message.author.id, krtodeposit);
        const depEmbed = utils.createEmbed(message.author, 'GREEN', `Deposited ${data.emotes.kr}${comma(krtodeposit)} , current bank balance is ${data.emotes.kr}${comma(depbal)}`);
        message.reply(depEmbed);
    },
};
