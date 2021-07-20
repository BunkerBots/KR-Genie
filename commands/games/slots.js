import data from '../../data/index.js';
import { MessageEmbed } from 'discord.js';
import db from '../../modules/db/economy.js';
import comma from '../../modules/comma.js';
import utils from '../../modules/messageUtils.js';
import { addXP } from '../../modules/db/levels.js';

const partnerEmote = data.emotes.partner;
const verifiedEmote = data.emotes.verified;
const premiumEmote = data.emotes.premium;
const krunkieEmote = data.emotes['krunkie-spin'];
const emotes = [partnerEmote, verifiedEmote, premiumEmote, krunkieEmote];
const winnings = { partnerEmote: 100, verifiedEmote: 10, premiumEmote: 5, krunkieEmote: 2 };

export default {
    name: 'slots',
    aliases: ['slot'],
    cooldown: 10,
    description: 'High risk High reward game, the chances to win are low there is a chance to bag 10x the bet',
    expectedArgs: 'k/slots (amount)',
    execute: async(message, args) => {
        //         if (!data.testers.includes(message.author.id)) return
        const balance = await db.utils.balance(message.author.id);
        const { wallet } = await db.utils.balance(message.author.id);
        if (!args[0]) return message.reply(utils.createEmbed(message.author, 'RED', 'You need to bet something...'));
        const KR = parseInt(utils.parse(args[0], balance));
        if (!Number.isInteger(KR)) return message.reply(utils.createEmbed(message.author, 'RED', 'Bet actual KR you dumb'));
        if (KR > wallet) return message.reply(utils.createEmbed(message.author, 'RED', `You do not have ${data.emotes.kr}${comma(KR)} in your wallet`));
        if (wallet <= 0) return message.reply(utils.createEmbed(message.author, 'RED', 'You can\'t bet thin air'));
        if (KR <= 0) return message.reply(utils.createEmbed(message.author, 'RED', 'You need to bet kr, not your dumb feelings'));
        if (KR > 100000) return message.reply(utils.createEmbed(message.author, 'RED', `The max amount you can bet is only ${data.emotes.kr} 100,000`));
        

        // wtf man
        const obj1 = emotes[Math.floor(Math.random() * emotes.length)];
        const obj2 = emotes[Math.floor(Math.random() * emotes.length)];
        const obj3 = emotes[Math.floor(Math.random() * emotes.length)];
        const obj4 = emotes[Math.floor(Math.random() * emotes.length)];
        const obj5 = emotes[Math.floor(Math.random() * emotes.length)];
        const obj6 = emotes[Math.floor(Math.random() * emotes.length)];
        const obj7 = emotes[Math.floor(Math.random() * emotes.length)];
        const obj8 = emotes[Math.floor(Math.random() * emotes.length)];
        const obj9 = emotes[Math.floor(Math.random() * emotes.length)];

        if (obj4 == obj5 && obj4 == obj6) {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`You won! 10x ${data.emotes.kr}${comma(KR)}`)
                .setDescription(`${obj1} | ${obj2} | ${obj3}\n${obj4} | ${obj5} | ${obj6} ⬅️\n${obj7} | ${obj8} | ${obj9}`)
                .setColor('GREEN');
            const win = KR * winnings[obj4];
            await db.utils.addKR(message.author.id, parseInt(win));
            message.channel.send(embed);
        } else {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('You lost!')
                .setDescription(`${obj1} | ${obj2} | ${obj3}\n${obj4} | ${obj5} | ${obj6} ⬅️\n${obj7} | ${obj8} | ${obj9}`)
                .setColor('RED');
            await db.utils.addKR(message.author.id, -KR);
            message.channel.send(embed);
        }
        if (KR >= 2000) addXP(message.author.id, 23, message);
    },
};
