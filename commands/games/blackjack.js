import db               from '../../modules/db/economy.js';
import comma            from '../../modules/comma.js';
import Deck             from '52-deck';
import { emotes }       from '../../data/index.js';
import { EventEmitter } from 'events';
import { MessageEmbed } from 'discord.js';
import messageUtils     from '../../modules/messageUtils.js';

// Game class
class Game extends EventEmitter {
    constructor({
        deck,
        hand,
        dealer,
    }) {
        super();
        this.deck   = deck;
        this.hand   = hand;
        this.dealer = dealer;
        this.hide   = true;
        return this;
    }

    start() {
        if (this.hand.values.includes(21) && this.dealer.hiddenValues.includes(21)) this.emit('push');
        else if (this.hand.values.includes(21)) this.emit('win', 'blackjack');
        else if (this.dealer.hiddenValues.includes(21)) this.emit('lose', 'blackjack');
    }

    hit() {
        this.hand.cards.push(this.deck.splice(0, 1));
        this.hand.values = cardsToValues(this.hands.cards, false);

        if (this.hand.values.includes(21)) {
            if (this.dealer.hiddenValues.includes(21)) this.emit('push');
            else this.emit('win');
        } else if (this.hand.values[0] > 21) this.emit('lose', 'bust');
        else this.emit('continue');
    }

    stand() {
        const   playerHighest = this.hand.values[this.hand.values.length - 1],
                dealerHighest = this.dealer.hiddenValues[this.dealer.hiddenValues.length - 1];

        if (playerHighest == dealerHighest) this.emit('push');
        else if (playerHighest < dealerHighest) this.emit('lose', '');
        else if (dealerHighest >= 17) this.emit('win', '');
        else {
            this.dealer.cards.push(this.deck.splice(0, 1));
            this.dealer.hiddenValues = cardsToValues(this.dealer.cards, false);

            if (this.dealer.hiddenValues[0] > 21) this.emit('win', 'bust');
            else this.stand();
        }
    }
}

// Game command
export default {
    name:           'bjack',
    aliases:        ['bj', 'blackjack'],
    cooldown:       5,
    description:    'A standard game of Blackjack',
    expectedArgs:   'k/bj [amount]',
    execute: async(message, args) => {
        if (!args[0]) return message.reply(messageUtils.createEmbed(message.author, 'RED', 'You need to bet something nerd...'));

        // Set up funds
        const balance   = await db.utils.balance(message.author.id);
        var bet         = messageUtils.parse(args[0], balance);

        if (isNaN(bet))                 return message.reply(messageUtils.createEmbed(message.author, 'RED', 'Provide a valid bet, don\'t try to break me'));
        else if (balance.wallet <= 0)   return message.reply(messageUtils.createEmbed(message.author, 'RED', 'lmao empty wallet'));
        else if (bet > balance.wallet)  return message.reply(messageUtils.createEmbed(message.author, 'RED', `You do not have ${comma(args)} in your wallet`));
        else if (bet <= 0)              return message.reply(messageUtils.createEmbed(message.author, 'RED', 'What is this? A charity?'));
        else {
            await db.utils.addKr(message.author.id, -1 * bet);
            message.reply(messageUtils.createEmbed(message.author, 'ORANGE', `${comma(args)} has been subtracted from your wallet`));
        }
        
        // Deal cards
        const   deck    = Deck.shuffle([...Deck.newDeck(), ...Deck.newDeck()]),
                hand    = { cards: deck.splice(0, 2) },
                dealer  = { cards: deck.splice(0, 2) };
        hand.values         = cardsToValues(hand.cards, false);
        dealer.publicValues = cardsToValues(dealer.cards, true);
        dealer.hiddenValues = cardsToValues(dealer.cards, false);

        const game  = new Game({ deck, hand, dealer });
        const embed = new MessageEmbed({
            color: 'GOLD',
            author: {
                name: `${message.author.tag} (${message.author.id})`,
                icon_url: message.author.avatarURL({ dynamic: true }),
            },
            description: `You bet ${emotes.kr} ${bet}`,
            fields: [
                {
                    name:   'Your Hand:',
                    value:  `\`\`\`${cardsToStr(hand.cards, false)}\`\`\` \nTotal: ${valuesToStr(hand.values)}`,
                    inline: true,
                },
                {
                    name:   'Dealer\'s Hand:',
                    value:  `\`\`\`${cardsToStr(dealer.cards, true)}\`\`\` \nTotal: ${valuesToStr(dealer.hiddenValues)}`,
                    inline: true,
                },
            ],
            footer: `Use \`hit\` and \`stand\` to play`,
        });
        const   gameMsg     = await message.channel.send(embed),
                collector   = message.channel.createMessageCollector(m => m.author.id == message.author.id && ['hit', 'stand'].includes(m.content.toLowerCase()), { time: 120000 });

        // Start game
        game.start();
        var ended = false;

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

        // Game Events
        game.on('win', reason => {
            embed.setColor('GREEN')
                .addField('You win!', `${reason == 'blackjack' ? '**You got blackjack!** ' : reason == 'bust' ? '**Dealer bust!** ' : ''}You win ${emotes.kr} **${2 * bet}**`);
            game.emit('end', 2 * bet);
        });
        game.on('lose', reason => {
            embed.setColor('RED')
                .addField('You lose...', `${reason == 'blackjack' ? '**Dealer got blackjack...** ' : reason == 'bust' ? '**Bust!** ' : ''}Better luck next time`);
            game.emit('end', 0);
        });
        game.on('push', () => {
            embed.setColor('BLUE')
                .addField('Push', `You get back your bet (${emotes.kr} **${bet}**)`);
            game.emit('end', bet);
        });
        game.on('continue', () => {
            updateEmbed(game, gameMsg, embed);
        });
        game.once('end', amount => {
            game.hide = false;
            ended = true;
            await db.utils.addKR(message.author.id, parseInt(amount));
            collector.stop();
        });
        
        // Game end
        await new Promise((res) => {
            collector.on('end', () => {
                if (ended) await updateEmbed(game, gameMsg, embed);
                else {
                    await db.utils.addKR(message.author.id, parseInt(bet));
                    return gameMsg.edit('Time\'s up! Game aborted.');
                }
                res();
            });
        });
    },
};

// Utils
const cardsToStr = (cards, hidden) => {
    var str = '';
    if (!hidden) {
        cards.forEach(card => {
            str += `${returnCardEmotes(card.suite)}${card.text}\n`;
        });
    } else {
        str = `${returnCardEmotes(cards[0].suite)}${cards[0].text}\n`;
        for (var i = 0; i < cards.length; i++) str += 'Unknown\n';
    }
    return str;
};
const returnCardEmotes = (suite) => {
    switch (suite) {
        case 'spades':      return '♠️';
        case 'hearts':      return '♥️';
        case 'clubs':       return '♣️';
        case 'diamonds':    return '♦️';
    }
};

const cardsToValues = (cards, hidden) => {
    if (!hidden) {
        if (!cards.some(card => card.text == 'A')) return [cards.reduce((sum, card) => sum += card.value, 0)];
    
        cards.splice(cards.findIndex(card => card.text == 'A'), 1);
        var values = [];
        cardsToValues(cards, hidden).forEach(otherValue => { 
            values.push(otherValue + 1);
            if (otherValue + 11 <= 21) values.push(otherValue + 11);
        });
        values.sort((a, b) => a - b).reduce((a, b) => {
            if (a.indexOf(b) == -1) a.push(b);
            return a;
        }, []);
        return values;
    } else {
        if (cards[0].text == 'A') return [1, 11];
        else return [cards[0].value];
    }
};

const valuesToStr = (values) => { return `**${values.join('**, **')}**`; };

const updateEmbed = async(game, gameMsg, embed) => {
    if (gameMsg.editable) gameMsg.edit(embed.fields = [
        {
            name:   'Your Hand:',
            value:  `\`\`\`${cardsToStr(hand.cards, false)}\`\`\` \nTotal: ${valuesToStr(hand.values)}`,
            inline: true,
        },
        {
            name:   'Dealer\'s Hand:',
            value:  `\`\`\`${cardsToStr(dealer.cards, game.hide)}\`\`\` \nTotal: ${valuesToStr(game.hide ? dealer.hiddenValues : dealer.publicValues)}`,
            inline: true,
        },
    ]);
};