import { MessageEmbed, Collection } from 'discord.js';
import db from './db.js';
import { emotes } from '../data/index.js';

const cache = new Collection();

class Roulette {

    constructor(channel) {
        this.channel = channel;
        this.players = [];
        const start = Date.now();
        this.startTime = start;
        this.endTime = start + 20 * 1000;
        this.endGame = async(roulette) => {
            const randomNumber = Math.floor(Math.random() * 37);
            const randomColour = randomNumber == 0 ? '' : Math.round(Math.random()) ? 'R' : 'B';
            const winners = new Collection();
            for (const entity of roulette.players) {
                if (entity.bet[2](randomNumber, randomColour)) {
                    const winnings = entity.bet[1] * entity.money;
                    winners.set(entity.user.id, winnings);
                    await db.utils.addKR(entity.user.id, winnings + entity.money);
                }
            }
            const embed = new MessageEmbed()
                .setTitle('Roulette')
                .setDescription(`The ball landed on **${randomColour ? randomColour == 'R' ? 'Red' : 'Black' : ''} ${randomNumber}**\n\n` + (winners.size ? parseCollection(winners) : 'No Winners'))
                .setColor(winners.size ? 'GREEN' : 'RED')
                .setTimestamp();
            roulette.channel.send(embed);
            roulette.end();
        };
        this.timeOut = channel.client.setTimeout(this.endGame, 20 * 1000, this);
        cache.set(channel.id, this);
        return this;
    }

    async addPlayer(user, bet, money) {
        // await db.utils.addKR(user.id, -money);
        const parsedBet = parseBet(bet);
        if (parsedBet) {
            this.players.push({
                user, bet: parsedBet, money,
            });
        }
        return parsedBet;
    }

    end() {
        cache.delete(this.channel.id);
    }

}
/**
 * @param  {String} bet
 * @returns {Array} [String(Resolved Bet), Integer(Payout Mult), Function(Determining Function)]
 */
const parseBet = (bet) => {
    bet = String(bet).toLowerCase();
    if (bet === 'even' || bet === 'e' || bet === 'eve') return ['even', 1, isEven];
    if (bet === 'odd' || bet === 'o') return ['odd', 1, isOdd];
    if (Number.isInteger(parseInt(bet)) && Number(bet) >= 0 && parseInt(bet) <= 36) return [parseInt(bet), 36, isNumber(parseInt(bet))];
    if (bet == 'red' || bet == 'r') return ['red', 1, isRed];
    if (bet == 'black' || bet == 'b') return ['black', 1, isBlack];
    if (bet == '1st') return ['1st', 2, isColumn(1)];
    if (bet == '2nd') return ['2nd', 2, isColumn(2)];
    if (bet == '3rd') return ['3rd', 2, isColumn(3)];
    if (bet == 'upper') return ['upper', 1, isUpper];
    if (bet == 'lower') return ['lower', 1, isLower];
    return false;
};

const isRed = (number, colour) => colour === 'R';
const isBlack = (number, colour) => colour === 'B';

const isEven = (number) => number % 2 === 0;
const isOdd = (number) => number % 2 === 1;

const isNumber = (num) => (number) => number === num;
const isColumn = (column) => (number) => (number > ((column - 1) * 12) && number <= (column * 12));
const isUpper = (number) => number >= 19;
const isLower = (number) => number < 19;

const parseCollection = (collection) =>
    'Winners: \n' + collection.map((v, k) => `<@${k}> has won ${emotes.kr} ${v}`).join('\n');

export {
    cache,
    Roulette
};
