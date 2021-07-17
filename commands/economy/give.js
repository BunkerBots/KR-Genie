import data from '../../data/index.js';
import db from '../../modules/db/economy.js';
import utils from '../../modules/messageUtils.js';
import comma from '../../modules/comma.js';
import { getLevel } from '../../modules/db/levels.js';

export default {
    name: 'give',
    aliases: ['pay', 'share', 'gift'],
    cooldown: 5,
    description: `Feeling generous? Use this command to give some ${data.emotes.kr} to an user`,
    expectedArgs: 'k/give (ID / @user) (amount)',
    execute: async(message, args) => {
        // ------------- Finding target ------------- //
        if (!args[0]) return message.channel.send(`Who are you giving ${data.emotes.kr} to?`);
        const user = await message.guild.members.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.reply(utils.createEmbed(message.author, 'RED', 'No user found nerd..'));

        // ------------- Fool proofing amount ------------- //

        if (user.id == message.author.id) return message.reply(utils.createEmbed(message.author, 'RED', 'Why are you gifting yourself?...'));
        const { wallet } = await db.utils.balance(message.author.id);
        const balance = await db.utils.balance(message.author.id);
        if (!args[1]) return message.reply(utils.createEmbed(message.author, 'RED', 'You can\'t gift thin air you dumb'));
        const krtogive = parseInt(utils.parse(args[1], balance));
        if (wallet <= 0) return message.channel.send(utils.createEmbed(message.author, 'RED', `You don't have any ${data.emotes.kr} in your wallet`));
        if (wallet < krtogive) return message.channel.send(utils.createEmbed(message.author, 'RED', `You do not have ${data.emotes.kr}${krtogive} in your wallet`));
        // if (krtogive < 0) return message.reply(utils.createEmbed(message.author, 'GREEN', `You gave <@${user.id}> ${data.emotes.kr}${comma(krtogive)} , now you have ${data.emotes.kr}${0} and they've got ${data.emotes.kr}${comma(krtogive)}.`).setFooter('Get jebaited lol, really think u can break me'));
        if (!Number.isInteger(krtogive)) return message.channel.send(utils.createEmbed(message.author, 'RED', 'What are you doing? That\'s not even a valid number'));
        if (krtogive <= 0) return message.channel.send(utils.createEmbed(message.author, 'RED', 'Are you trying to break the bot or what, provide and actual number!'));

        // ------------- Anti alt ------------- //

        const authorLevel = await getLevel(message.author.id);
        const userLevel = await getLevel(user.id);
        if (authorLevel < 5 || userLevel < 5) return message.channel.send(utils.createEmbed(message.author, 'RED', 'Players must be above level 5 to share or accept KR'));

        // ------------- Tax ------------- //
        const tenpercent = Math.ceil(10 * krtogive / 100);
        const premium = await db.utils.premium(message.author.id);
        await db.utils.addKR(message.author.id, -krtogive);
        const authorbal = await db.utils.balance(message.author.id);
        const userbal = await db.utils.balance(user.id);
        let kr, desc, footer;
        if (premium == true) {
            kr = krtogive;
            desc = `You gave <@${user.id}> ${data.emotes.kr}${comma(kr)} , now you have ${data.emotes.kr}${comma(authorbal.wallet)} and they've got ${data.emotes.kr}${comma(userbal.bank + kr)}.`;
            footer = 'Premium perks : no tax';
        } else {
            kr = parseInt(krtogive - tenpercent);
            desc = `You gave <@${user.id}> ${data.emotes.kr}${comma(kr)} after 10% tax, now you have ${data.emotes.kr}${comma(authorbal.wallet)} and they've got ${data.emotes.kr}${comma(userbal.bank + kr)}.`;
            footer = 'stonks';
        }
        await db.utils.addKrToBank(user.id, kr);
        const giveEmbed = utils.createEmbed(message.author, 'GREEN', desc);
        message.reply(giveEmbed.setFooter(footer));
    },
};
