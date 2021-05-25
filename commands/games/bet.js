import { MessageEmbed } from 'discord.js';
import data from '../../data/index.js';
import db from '../../modules/db/economy.js';
import comma from '../../modules/comma.js';
import utils from '../../modules/messageUtils.js';
import { addXP } from '../../modules/db/levels.js';


export default {
    name: 'bet',
    aliases: ['gamble'],
    cooldown: 10,
    description: '50 - 50 chance to win or lose the bet. It\'s an easy way to make stonks if your luck doesn\'t stink.',
    expectedArgs: 'k/bet (amount)',
    execute: async(message, args) => {
        const balance = await db.utils.balance(message.author.id);
        if (!args[0]) return message.reply(utils.createEmbed(message.author, 'RED', 'What are you betting nerd?'));
        const krtobet = parseInt(utils.parse(args[0], balance));
        if (isNaN(krtobet)) return message.reply(utils.createEmbed(message.author, 'RED', 'What do I look like to you? Provide a valid amount to bet'));
        if (balance.wallet < krtobet) return message.reply(utils.createEmbed(message.author, 'RED', `You do not have ${data.emotes.kr}${comma(krtobet)} in your wallet`));
        if (krtobet < 100) return message.reply(utils.createEmbed(message.author, 'RED', `oops, the minimum amount you can bet is ${data.emotes.kr}100!`));
        if (krtobet > 25000) return message.reply(utils.createEmbed(message.author, 'RED', `The max amount you can bet is only ${data.emotes.kr} 25,000`));
        const res = Math.floor(Math.random() * 2);
        let color, description, footer;
        if (res == 1) {
            // const percentWon = Math.floor(Math.random() * 25) + 75;
            // const finalWin = Math.ceil(percentWon * krtobet / 100);
            description = `Lucky ducky you won the bet! ${data.emotes.kr}${comma(krtobet)}`,
            color = 'GREEN',
            footer = 'stonks4u';
            await db.utils.addKR(message.author.id, parseInt(krtobet));
        } else {
            description = 'LMAO you lost the bet',
            color = 'RED',
            footer = 'notstonks4u';
            await db.utils.addKR(message.author.id, -krtobet);
        }
        message.reply(new MessageEmbed() // test
            .setColor(color)
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(description)
            .setFooter(footer));
        if (krtobet >= 2000) addXP(message.author.id, 23, message);
    },
};
