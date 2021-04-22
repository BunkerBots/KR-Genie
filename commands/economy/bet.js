const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const db = require('../../modules');

module.exports = {
    name: 'bet',
    aliases: ['gamble'],
    cooldown: 10,
    execute: async(message, args) => {
        const { wallet } = await db.utils.balance(message.author.id);
        if (!args[1]) return message.reply('What are you betting nerd?');
        if (args[1].toLowerCase() === 'all') {
            if (wallet <= 0) return message.reply(`You do not have any ${data.emotes.kr} in your wallet`);
            const res = Math.floor(Math.random() * 2);
            if (res === 1) {
                await db.utils.addKR(message.author.id, parseInt(wallet));
                message.reply(new MessageEmbed()
                    .setColor('GREEN')
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                    .setDescription(`Lucky ducky , you won the bet! ${data.emotes.kr}${wallet}`)
                    .setFooter('stonks4u'));
            } else {
                await db.utils.addKR(message.author.id, -parseInt(wallet));
                message.reply(new MessageEmbed()
                    .setColor('RED')
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                    .setDescription('LMAO you lost the bet!')
                    .setFooter('sucks to suck'));
            }

            return;
        }
        if (isNaN(args[1])) return message.reply('What do I look like to you? Provide a valid amount to bet');
        const KRargs = parseInt(args[1]);
        if (wallet < KRargs) return message.reply(`You do not have ${KRargs} in your wallet`);
        if (KRargs <= 0) return message.reply('How about you try to provide an actual number?');
        const res = Math.floor(Math.random() * 2);
        if (res == 1) {
            await db.utils.addKR(message.author.id, KRargs);
            message.reply(new MessageEmbed()
                .setColor('GREEN')
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`Lucky ducky , you won the bet! ${data.emotes.kr}${args[1]}`)
                .setFooter('stonks4u'));
        } else {
            await db.utils.addKR(message.author.id, -KRargs);
            message.reply(new MessageEmbed()
                .setColor('RED')
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription('LMAO you lost the bet!')
                .setFooter('sucks to suck'));
        }
    },
};
