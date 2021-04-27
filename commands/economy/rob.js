const data = require('../../data');
const { MessageEmbed } = require('discord.js');
const db = require('../../modules/'),
    comma = require('../../modules/comma');

module.exports = {
    name: 'rob',
    aliases: ['steal'],
    cooldown: 120,
    execute: async(message, args) => {
        if (!args[0]) return message.reply('Who are we robbing?');
        const target = await message.guild.members.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.reply('Unknown user');
        const robchance = Math.floor(Math.random() * 2);
        if (target.id === message.author.id) return message.reply('Did you just try to rob yourself?..');
        if (robchance == 1) {
            const i = await db.utils.balance(message.author.id);
            if (i.wallet < parseInt(250)) return message.reply(`You atleast need ${data.emotes.kr}250 in your wallet!`);
            const { wallet } = await db.utils.balance(target.id);
            if (wallet <= 0) return message.reply('You can\'t rob a guy with empty wallet , get a standard bro');
            const robbedKR = parseInt(Math.floor(Math.random() * wallet));
            await db.utils.addKR(target.id, -robbedKR);
            await db.utils.addKR(message.author.id, robbedKR);
            message.reply(`You stole a sweet amount of ${data.emotes.kr}${comma(robbedKR)} from ${target.user.username}`);
        } else {
            await db.utils.addKR(message.author.id, -parseInt(250));
            message.reply(`You were caught stealing and lost ${data.emotes.kr}250`);
        }
    },
};
