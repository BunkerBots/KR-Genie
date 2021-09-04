import db from '../../modules/db/economy.js';
import comma from '../../modules/comma.js';
import Deck from '52-deck';
import { emotes } from '../../data/index.js';
import { EventEmitter } from 'events';
import { MessageEmbed } from 'discord.js';
import messageUtils from '../../modules/messageUtils.js';

const existingGames = [];

// Game class
class Game extends EventEmitter {

    constructor({ deck, hand, dealer, message }) {
        super();
        this.deck = deck;
        this.hand = hand;
        this.dealer = dealer;
        this.message = message;
        this.hide = true;
        this.last = -1;
        return this;
    }

    start() {
        if (this.hand.values.includes(21) && this.dealer.hiddenValues.includes(21)) this.emit('push');
        else if (this.hand.values.includes(21)) this.emit('win', 'blackjack');
        else if (this.dealer.hiddenValues.includes(21)) this.emit('lose', 'blackjack');
    }

    async hit() {
        const newCard = this.deck.shift();
        this.hand.cards.push(newCard);
        this.hand.values = cardsToValues(this.hand.cards, false);
        if (this.last != -1) this.last.delete();
        this.last = await this.message.channel.send(messageUtils.createEmbed(this.message.author, 'YELLOW', `\`\`\`You drew: ${cardToStr(newCard)}\`\`\``));

        if (this.hand.values.includes(21)) {
            if (this.dealer.hiddenValues.includes(21)) this.emit('push');
            else this.emit('win');
        } else if (this.hand.values[0] > 21) this.emit('lose', 'bust');
        else this.emit('continue');
    }

    stand() {
        const playerHighest = this.hand.values[this.hand.values.length - 1],
            dealerHighest = this.dealer.hiddenValues[this.dealer.hiddenValues.length - 1];

        if (playerHighest == dealerHighest && dealerHighest >= 17) this.emit('push');
        else if (playerHighest < dealerHighest) this.emit('lose', '');
        else if (dealerHighest >= 17) this.emit('win', '');
        else {
            this.dealer.cards.push(this.deck.shift());
            this.dealer.hiddenValues = cardsToValues(this.dealer.cards, false);

            if (this.dealer.hiddenValues[0] > 21) this.emit('win', 'bust');
            else this.stand();
        }
    }

}

// Game command
export default {
    name: 'bjack',
    aliases: ['bj', 'blackjack'],
    cooldown: 5,
    description: 'A standard game of Blackjack',
    expectedArgs: 'k/bj [amount]',
    manualStamp: true,
    execute: async(message, args) => {
        if (!args[0]) return message.reply(messageUtils.createEmbed(message.author, 'RED', 'You need to bet something nerd...'));

        // Set up funds
        const balance = await db.utils.balance(message.author.id);
        const bet = messageUtils.parse(args[0], balance);

        if (isNaN(bet)) return message.reply(messageUtils.createEmbed(message.author, 'RED', 'Provide a valid bet, don\'t try to break me'));
        else if (balance.wallet <= 0) return message.reply(messageUtils.createEmbed(message.author, 'RED', 'lmao empty wallet'));
        else if (bet > balance.wallet) return message.reply(messageUtils.createEmbed(message.author, 'RED', `You do not have ${comma(args)} in your wallet`));
        else if (bet <= 10) return message.reply(messageUtils.createEmbed(message.author, 'RED', 'What is this? A charity?'));
        else if (existingGames.includes(message.author.id)) return message.reply(messageUtils.createEmbed(message.author, 'RED', 'Finish your other game first'));
        else {
            await db.utils.addKR(message.author.id, -1 * bet);
            message.reply(messageUtils.createEmbed(message.author, 'ORANGE', `${emotes.kr} ${comma(bet)} has been subtracted from your wallet`));
            existingGames.push(message.author.id);
        }
        // Deal cards
        const deck = Deck.shuffle([...Deck.newDeck(), ...Deck.newDeck()]),
            hand = { cards: deck.splice(0, 2) },
            dealer = { cards: deck.splice(0, 2) };
        hand.values = cardsToValues(hand.cards, false);
        dealer.publicValues = cardsToValues(dealer.cards, true);
        dealer.hiddenValues = cardsToValues(dealer.cards, false);

        const game = new Game({ deck, hand, dealer, message });
        const embed = new MessageEmbed({
            color: 'GOLD',
            author: {
                name: `${message.author.tag} (${message.author.id})`,
                icon_url: message.author.avatarURL({ dynamic: true }),
            },
            fields: [
                {
                    name: 'Your Hand:',
                    value: `\`\`\`${cardsToStr(hand.cards, false)}\`\`\` \nTotal: ${valuesToStr(hand.values)}`,
                    inline: true,
                },
                {
                    name: 'Dealer\'s Hand:',
                    value: `\`\`\`${cardsToStr(dealer.cards, true)}\`\`\` \nTotal: ${valuesToStr(dealer.publicValues)}`,
                    inline: true,
                },
            ],
            footer: {
                text: `Use "hit" and "stand" to play | You bet ${bet} KR`,
            },
        });
        const gameMsg = await message.channel.send({ embeds: [embed] }),
            filter = m => m.author.id == message.author.id && ['hit', 'stand'].includes(m.content.toLowerCase()),
            collector = message.channel.createMessageCollector({ filter, time: 120000 });

        // Game Events
        let ended = false;
        game.on('win', reason => {
            embed.setColor('GREEN');
            if (game.last != -1) game.last.delete();
            message.channel.send(messageUtils.createEmbed(message.author, 'GREEN', `${reason == 'blackjack' ? '**You got blackjack!**' : reason == 'bust' ? '**Dealer bust!**' : '**You win!**'} You get ${emotes.kr} **${2 * bet}**`));
            game.emit('end', 2 * bet);
        });
        game.on('lose', reason => {
            embed.setColor('RED');
            if (game.last != -1) game.last.delete();
            message.channel.send(messageUtils.createEmbed(message.author, 'RED', `${reason == 'blackjack' ? '**Dealer got blackjack...**' : reason == 'bust' ? '**Bust!**' : '**You lose...**'} Better luck next time`));
            game.emit('end', 0);
        });
        game.on('push', () => {
            embed.setColor('BLUE');
            if (game.last != -1) game.last.delete();
            message.channel.send(messageUtils.createEmbed(message.author, 'BLUE', `**Push**, you get back your bet (${emotes.kr} **${bet}**)`));
            game.emit('end', bet);
        });
        game.on('continue', () => {
            updateEmbed(game, gameMsg, embed);
        });
        game.once('end', async(amount) => {
            game.hide = false;
            ended = true;
            await db.utils.addKR(message.author.id, parseInt(amount));
            collector.stop();
        });

        // Start game
        game.start();

        // Player Events
        collector.on('collect', async(recvMsg) => {
            switch (recvMsg.content.toLowerCase()) {
            case 'hit':
                game.hit();
                break;
            case 'stand':
                game.stand();
                break;
            }
        });

        // Game end
        await new Promise((res) => {
            collector.on('end', async() => {
                if (ended) await updateEmbed(game, gameMsg, embed);
                else
                    gameMsg.edit('Time\'s up! Game aborted.');
                existingGames.splice(existingGames.indexOf(message.author.id), 1);
                res();
            });
        });
    },
};

// Utils
const cardsToStr = (cards, hidden) => {
    let str = '';
    if (!hidden) {
        cards.forEach(card => {
            str += `${cardToStr(card)}\n`;
        });
    } else str = `${cardToStr(cards[0])} \nUnknown`;
    return str;
};

const cardToStr = (card) => {
    return `${returnCardEmotes(card.suite)} ${card.text}`;
};

const returnCardEmotes = (suite) => {
    switch (suite) {
    case 'spades': return '♠️';
    case 'hearts': return '♥️';
    case 'clubs': return '♣️';
    case 'diamonds': return '♦️';
    }
};

const cardsToValues = (cards, hidden) => {
    if (!hidden) {
        if (!cards.some(card => card.text == 'A')) return [cards.reduce((sum, card) => sum += card.value, 0)];

        const tempCards = cards.slice();
        tempCards.splice(tempCards.findIndex(card => card.text == 'A'), 1);
        const values = [];
        cardsToValues(tempCards, hidden).forEach(otherValue => {
            if (otherValue < 21 || !tempCards.some(card => card.text == 'A')) values.push(otherValue + 1);
            if (otherValue + 11 <= 21) values.push(otherValue + 11);
        });
        values.sort((a, b) => a - b);
        return Array.from(new Set(values));
    } else if (cards[0].text == 'A') return [1, 11];
    else return [parseInt(cards[0].value)];
};

const valuesToStr = (values) => { return `**${values.join('**, **')}**`; };

const updateEmbed = async(game, gameMsg, embed) => {
    embed.fields = [];
    embed.addFields(
        {
            name: 'Your Hand:',
            value: `\`\`\`${cardsToStr(game.hand.cards, false)}\`\`\` \nTotal: ${valuesToStr(game.hand.values)}`,
            inline: true,
        },
        {
            name: 'Dealer\'s Hand:',
            value: `\`\`\`${cardsToStr(game.dealer.cards, game.hide)}\`\`\` \nTotal: ${valuesToStr(game.hide ? game.dealer.publicValues : game.dealer.hiddenValues)}`,
            inline: true,
        },
    );
    if (gameMsg.editable) gameMsg.edit(embed);
};
