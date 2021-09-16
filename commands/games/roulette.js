import { MessageEmbed } from 'discord.js';
import data from '../../data/index.js';
import db from '../../modules/db/economy.js';
import comma from '../../modules/comma.js';
import utils from '../../modules/messageUtils.js';
import { Roulette, cache } from '../../modules/Roulette.js';


export default {
    name: 'roulette',
    aliases: ['roul'],
    cooldown: 10,
    description: 'A standard roulette game, 1x payout on red/black and 10x payout on single number bets',
    expectedArgs: 'k/roulette (amount) (red/black/odd/even/column/1-36)',
    execute: async(message, args) => {
        if (args.length == 0) {
            const game = cache.get(message.channel.id);
            if (game) {
                const embed = new MessageEmbed()
                    .setTitle('Ongoing Roulette')
                    .setColor('GOLD')
                    .setDescription(game.players.map((v) => `<@${v.user.id}> bet ${data.emotes.kr} ${v.money} on ${v.bet[0]}`))
                    .setFooter(Math.round((game.endTime - Date.now()) / 1000) + ' Seconds left');
                return message.channel.send({ embeds: [embed] });
            }
        }
        const balance = await db.utils.balance(message.author.id);
        if (!balance) return message.reply(utils.createEmbed(message.author, 'RED', 'Empty wallet lol, ur broke'));
        if (!args[0]) return message.reply(utils.createEmbed(message.author, 'RED', 'What are you betting nerd?'));
        const betAmount = parseInt(utils.parse(args[0], balance));
        if (isNaN(betAmount)) return message.reply(utils.createEmbed(message.author, 'RED', 'What do I look like to you? Provide a valid amount to bet'));
        if (betAmount <= 0) return message.reply(utils.createEmbed(message.author, 'RED', 'You can\'t bet thin air'));
        if (balance.wallet < betAmount) return message.reply(utils.createEmbed(message.author, 'RED', `You do not have ${data.emotes.kr}${comma(betAmount)} in your wallet`));
        if (!args[1]) return message.reply(utils.createEmbed(message.author, 'RED', 'What are you betting on?'));
        const game = cache.get(message.channel.id) || new Roulette(message.channel);
        const bet = await game.addPlayer(message.author, args[1], betAmount);
        if (!bet[0]) {
            game.end();
            return message.reply(utils.createEmbed(message.author, 'RED', 'What are you trying to bet on??\nChoose from even|odd, red|black, or a number or a column'));
        }
        if (bet) {
            const { embeds } = utils.createEmbed(message.author, 'GREEN', `You have succesfully bet ${data.emotes.kr} ${comma(betAmount)} on ${bet[0]}`);
            embeds[0].setFooter(Math.round((game.endTime - Date.now()) / 1000) + ' Seconds left');
            message.reply({ embeds: [embeds] });
            await db.utils.addKR(message.author.id, -betAmount);
        } else
            message.reply(utils.createEmbed(message.author, 'RED', 'What are you trying to bet on??\nChoose from even|odd, red|black, or a number or a column'));
    },
};
