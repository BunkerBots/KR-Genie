const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const db = require('../../modules'),
    comma = require('../../modules/comma'),
    utils = require('../../modules/messageUtils');

module.exports = {
    name: 'bet',
    aliases: ['gamble'],
    cooldown: 10,
    execute: async(message, args) => {
        const balance = await db.utils.balance(message.author.id);
        if (!args[0]) return message.reply('What are you betting nerd?');
        const krtobet = parseInt(utils.parse(args[0], balance));
        if (isNaN(krtobet)) return message.reply('What do I look like to you? Provide a valid amount to bet');
        if (balance.wallet < krtobet) return message.reply(`You do not have ${data.emotes.kr}${comma(krtobet)} in your wallet`);
        if (krtobet <= 0) return message.reply('How about you try to provide an actual number?');
        const res = Math.floor(Math.random() * 2);
        let color, description, footer;
        if (res == 1) {
            description = `Lucky ducky you won the bet! ${data.emotes.kr}${comma(krtobet)}`,
            color = 'GREEN',
            footer = 'stonks4u';
            await db.utils.addKR(message.author.id, krtobet);
        } else {
            description = 'LMAO you lost the bet',
            color = 'RED',
            footer = 'notstonks4u';
            await db.utils.addKR(message.author.id, -krtobet);
        }
        message.reply(new MessageEmbed()
            .setColor(color)
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
            .setDescription(description)
            .setFooter(footer));
    },
};
