const { MessageEmbed } = require('discord.js');
const { EventEmitter } = require('events');
const Deck = require('52-deck');
const db = require('../../modules'),
    devs = require('../../data').devs,
    { createEmbed, parse } = require('../../modules/messageUtils');


module.exports = {
    name: 'bjack',
    aliases: ['bj', 'blackjack'],
    dev: true,
    execute: async(msg) => {
        if (!devs.includes(msg.author.id)) return;
        const balance = await db.utils.balance(msg.author.id);
        const args = msg.content.split(' ')[1];
        if (!args) return msg.reply(createEmbed(msg.author, 'RED', 'You need to bet something nerd..'));
        let bet = parse(args, balance.wallet);
        if (!bet) return msg.reply(createEmbed(msg.author, 'RED', 'I need a valid bet!'));
        const deck = Deck.shuffle(Deck.newDeck());
        const dealerCard = deck.shift();
        const hand = deck.splice(0, 2);
        // Value Between 16 - 23
        const dealerValue = Math.floor(Math.random() * 7) + 16;

        const dealerCardsValue = fillWithRandom(dealerValue - dealerCard.value);
        console.log(dealerCardsValue);
        const dealerCards = [dealerCard, ...dealerCardsValue.map(x => Deck.makeCard(x == 10 ? ['10', 'J', 'Q', 'K', 'A'][Math.floor(Math.random() * 5)] : x, ['♠️', '♣️', '♥️', '♦️'][Math.floor(Math.random() * 4)]))];

        const game = new Game({
            hand,
            dealerCard,
            dealerCards,
            dealerValue,
        });

        const
            embed = new MessageEmbed({
                color: 'GOLD',
                description: '`Hit` to draw a card or `stand` to finish the game',
                fields: [
                    {
                        name: 'Your Cards',
                        value: CardToText(hand) + `\nTotal: ${sumCards(hand)}`,
                        inline: true,
                    },
                    {
                        name: 'Dealer\'s Cards',
                        value: CardToText(dealerCard) + `\nTotal: ${dealerCard.value}`,
                        inline: true,
                    },
                ],
            }).setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true })),
            gmsg = await msg.channel.send(embed);
        const collector = msg.channel.createMessageCollector(x => x.author.id == msg.author.id && ['hit', 'stand', 'dd', 'double down'].includes(x.content.toLowerCase()), { time: 120000 });

        game.checkGame();
        let ended = false;
        collector.on('collect', async(recvMsg) => {
            if (recvMsg.content.toLowerCase() == 'hit') {
                const newCard = deck.shift();
                game.hand.push(newCard);
                await updateEmbed(gmsg, embed, game);
                game.checkGame();
            } else if (recvMsg.content.toLowerCase() == 'stand') {
                game.show = true;
                game.checkGame(true);
            } else if (['dd', 'double down'].includes(recvMsg.content.toLowerCase())) {
                bet = bet * 2;
                const newCard = deck.shift();
                game.hand.push(newCard);
                await updateEmbed(gmsg, embed, game);
                game.show = true;
                game.checkGame(true);
            }
        });
        game.on('blackjack', win => {
            // Player Blackjack :D
            if (win) {
                embed.setTitle('You have gotten Blackjack!');
                game.emit('end', 1);
            } else { // Dealer Blackjack :(
                embed.setTitle('Dealer has blackjack');
                game.emit('end', 0);
            }
        });
        game.on('bust', win => {
            // Dealer Bust :D (Only known after stand)
            if (win) {
                embed.setTitle('Dealer Bust!');
                game.emit('end', 1);
            } else { // Player Bust :(
                embed.setTitle('Bust!');
                game.emit('end', 0);
            }
        });
        game.once('end', win => {
            game.show = true;
            ended = true;
            // Player won! :D
            if (win == 1) {
                embed.setColor('GREEN');
                db.utils.addKR(msg.author.id, bet);
            } if (win == 2) { // Draw
                embed.setColor('ORANGE').setTitle('DRAW!');
            } else if (win == 0) { // Dealer won :(
                embed.setColor('RED');
                db.utils.addKR(msg.author.id, -bet);
            }
            collector.stop();
        });
        await new Promise((res) => {
            collector.on('end', () => {
                if (ended)
                    updateEmbed(gmsg, embed, game);
                else
                    return gmsg.edit('Time is up, aborting match!');

                res();
            });
        });
    },
};

const CardToText = (cards) => {
    if (cards instanceof Array) {
        let string = '';
        cards.forEach(card => {
            string += `\`\`\`${_CardToText(card)} \`\`\``;
        });
        return string;
    } else
        return `\`\`\`${_CardToText(cards)} \`\`\``;
};

const _CardToText = (card) => {
    return /* `${card.suite.capitalize()} */ `:${card.suite}: ${parseCardText(card.text)} `;
};

const map = {
    'J': 'Jack',
    'Q': 'Queen',
    'K': 'King',
    'A': 'Ace',
};
const parseCardText = text => parseInt(text) ? text : map[text] || text;
const sumCards = cards => cards.reduce((sum, card) => sum += card.value, 0);
const updateEmbed = async(gmsg, embed, game) => {
    embed.fields = [];
    embed.addField('Your Cards', CardToText(game.hand) + `\n\nTotal: ${sumCards(game.hand)}`, true);
    if (!game.show) embed.addField('Dealer\'s Cards', CardToText(game.dealerCard) + `:question: ?\n\nTotal: ${game.dealerCard.value}`, true);
    if (game.show) embed.addField('Dealer\'s Cards', CardToText(game.dealerCards) + `\n\nTotal: ${sumCards(game.dealerCards)}`, true).description = 'Game over';
    // embed.setImage(await CardToImage(game));
    if (gmsg.editable) gmsg.edit(embed);
};

const fillWithRandom = (total) => {
    const max = 10;
    let len = 2;
    if (total > 20) len = 3;
    if (total < 10) len = 1;
    let arr = new Array(len);
    let sum = 0;
    do {
        for (let i = 0; i < len; i++)
            arr[i] = Math.random();
        sum = arr.reduce((acc, val) => acc + val, 0);
        const scale = Number((total - len) / sum);
        arr = arr.map(val => Math.min(max, Math.round(val * scale) + 1));
        sum = arr.reduce((acc, val) => acc + val, 0);
    } while (sum - total);
    return arr;
};

class Game extends EventEmitter {

    constructor({
        hand,
        dealerCard,
        dealerCards,
        dealerValue,
    }) {
        super();
        this.hand = hand;
        this.dealerCard = dealerCard;
        this.dealerCards = dealerCards;
        this.dealerValue = dealerValue;
        this.show = false;
        return this;
    }

    checkGame(stand) {
        if (sumCards(this.hand) == 21)
            this.emit('blackjack', 1);
        else if (this.dealerValue == 21)
            this.emit('blackjack', 0);
        if (sumCards(this.hand) > 21)
            this.emit('bust', 0);


        if (stand) {
            if (this.dealerValue > 21) this.emit('bust', 1);
            if (sumCards(this.hand) > this.dealerValue) this.emit('end', 1);
            if (sumCards(this.hand) == this.dealerValue) this.emit('end', 2);
            else this.emit('end', 0);
        }
    }

}

