const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const db = require('../../modules'),
    comma = require('../../modules/comma'),
    utils = require('../../modules/messageUtils'),
    levels = require('../../mongo');

module.exports = {
    name: 'roulette',
    aliases: ['roul'],
    cooldown: 10,
    description: 'A standard roulette game, 1x payout on red/black and 10x payout on single number bets',
    expectedArgs: 'k/roulette (amount) (red/black/1-36)',
    execute: async(message, args) => {
        const balance = await db.utils.balance(message.author.id);
        if (!args[0]) return message.reply(utils.createEmbed(message.author, 'RED', 'What are you betting nerd?'));
        const krtobet = parseInt(utils.parse(args[0], balance));
        if (isNaN(krtobet)) return message.reply(utils.createEmbed(message.author, 'RED', 'What do I look like to you? Provide a valid amount to bet'));
        if (balance.wallet < krtobet) return message.reply(utils.createEmbed(message.author, 'RED', `You do not have ${data.emotes.kr}${comma(krtobet)} in your wallet`));
        if (!args[1]) return message.reply(utils.createEmbed(message.author, 'RED', 'What are you betting on?'));
        const betValue = [];
        const lowEnd = 1;
        const highEnd = 36;
        for (let i = lowEnd; i <= highEnd; i++)
            betValue.push(i);
        console.log([args[1], betValue]);
        let val;
        if (betValue.includes(parseInt(args[1]))) val = parseInt(args[1]);
        else if (['red', 'black'].includes(args[1])) val = args[1];
        else return message.reply(utils.createEmbed(message.author, 'RED', 'Unknown bet'));
        console.log(args[1]);
        if (krtobet < 100) return message.reply(utils.createEmbed(message.author, 'RED', `oops, the minimum amount you can bet is ${data.emotes.kr}100!`));
        const res = Math.floor(Math.random() * 36);
        const getColor = (str) => {
            let color;
            if (parseInt(str % 2) == 0) color = 'black';
            else color = 'red';
            return color;
        };
        let color, description, footer;
        const betColor = getColor(res);
        console.log([res, betColor]);
        if (val == res) {
            description = `You won 10 x${data.emotes.kr}${comma(krtobet)}, the ball landed on **${betColor} ${res}**`;
            color = 'GREEN';
            footer = 'stonks';
            await db.utils.addKR(message.author.id, parseInt(10 * krtobet));
        } else if (val == betColor) {
            description = `You won ${data.emotes.kr}${comma(krtobet)}, the ball landed on **${betColor} ${res}**`;
            color = 'GREEN';
            footer = 'stonks';
            await db.utils.addKR(message.author.id, parseInt(krtobet));
        } else {
            description = `You lost the ball landed on **${betColor} ${res}**`;
            color = 'RED';
            footer = 'notstonks';
        }
        message.reply(new MessageEmbed() // test
            .setColor(color)
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(description)
            .setFooter(footer));
        if (krtobet >= 2000) levels.addXP(message.author.id, 23, message);
    },
};
