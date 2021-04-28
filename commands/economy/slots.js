const data = require('../../data');
const { MessageEmbed } = require('discord.js');
const db = require('../../modules/'),
    comma = require('../../modules/comma'),
    utils = require('../../modules/messageUtils');

module.exports = {
    name: 'slots',
    aliases: [],
    execute: async(message, args) => {
        //         if (!data.testers.includes(message.author.id)) return
        const balance = await db.utils.balance(message.author.id);
        const { wallet } = await db.utils.balance(message.author.id);
        if (!args[0]) return message.reply('You need to bet something...');
        const KR = parseInt(utils.parse(args[0], balance));
        if (KR > wallet) return message.reply(`You do not have ${data.emotes.kr}${comma(KR)} in your wallet`);
        if (wallet <= 0) return message.reply('You can\'t bet thin air');
        const partnerEmote = data.emotes.partner;
        const verifiedEmote = data.emotes.verified;
        const premiumEmote = data.emotes.premium;
        const krunkieEmote = data.emotes['krunkie-spin'];
        const emotes = [partnerEmote, verifiedEmote, premiumEmote, krunkieEmote];

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
            const win = KR * 10;
            await db.utils.addKR(message.author.id, parseInt(win));
            message.channel.send(embed);
        } else {
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle('You lost!')
                .setDescription(`${obj1} | ${obj2} | ${obj3}\n${obj4} | ${obj5} | ${obj6} ⬅️\n${obj7} | ${obj8} | ${obj9}`)
                .setColor('RED');
            await db.utils.addKR(message.author.id, -KR);
            message.channel.send(embed);
        }
    },
};
