const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const db = require('../../modules'),
    comma = require('../../modules/comma'),
    utils = require('../../modules/messageUtils'),
    levels = require('../../mongo');
const { Roulette, cache } = require('../../modules/Roulette');

module.exports = {
    name: 'roulette',
    aliases: ['roul'],
    cooldown: 10,
    description: 'A standard roulette game, 1x payout on red/black and 10x payout on single number bets',
    expectedArgs: 'k/roulette (amount) (red/black/1-36)',
    execute: async(message, args) => {
        const balance = await db.utils.balance(message.author.id);
        if (!args[0]) return message.reply(utils.createEmbed(message.author, 'RED', 'What are you betting nerd?'));
        const betAmount = parseInt(utils.parse(args[0], balance));
        if (isNaN(betAmount)) return message.reply(utils.createEmbed(message.author, 'RED', 'What do I look like to you? Provide a valid amount to bet'));
        if (balance.wallet < betAmount) return message.reply(utils.createEmbed(message.author, 'RED', `You do not have ${data.emotes.kr}${comma(betAmount)} in your wallet`));
        if (!args[1]) return message.reply(utils.createEmbed(message.author, 'RED', 'What are you betting on?'));
        const game = cache.get(message.channel.id) || new Roulette(message.chanel);
        const bet = game.addPlayer(message.author, betAmount, args[1]);
        if (!bet) {
            message.channel.send(utils.createEmbed(message.author, 'GREEN', `You have succesfully bet ${data.emotes.kr} ${comma(betAmount)} on ${bet}`)
                .setFooter(Math.round((Roulette.endTime - Date.now()) / 1000) + ' Seconds left'),
            );
        }
    },
};
