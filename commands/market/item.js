// eslint-disable-next-line no-unused-vars
const { MessageEmbed } = require('discord.js'),
    comma = require('../../modules/comma'),
    db = require('../../modules'),
    emotes = require('../../data').emotes,
    items = require('../../data/items');

module.exports = {
    name: 'item',
    aliases: ['info'],
    cooldown: 10,
    execute: async(message, args) => {
        if (!args[0]) return message.reply('You need to provide an item name lmao');
        const arg = args.join(' ').toLowerCase();
        const found = items.find(x => x.name.toLowerCase() === arg);
        if (found) {
            if (found.type === 'c') {
                message.channel.send(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                    .setTitle(`${found.icon} ${found.name}`)
                    .setDescription(`${found.description}\n**Buy :** ${emotes.kr}${comma(found.price)}\n**Sell :** Collectables cannot be sold`)
                    .setFooter('Item type : collectable'));
            } else if (found.type === 'b') {
                message.channel.send(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                    .setTitle(`${found.icon} ${found.name}`)
                    .setDescription(`${found.description}\n**Buy :** ${emotes.kr}${comma(found.price)}\n**Sell :** Badges cannot be sold`)
                    .setFooter('Item type : badge'));
            } else if (found.type === 's') {
                message.channel.send(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                    .setTitle(`${found.icon} ${found.name}`)
                    .setDescription(`${found.description}\n**Buy :** ${emotes.kr}${comma(found.price)}`)
                    .setFooter('Item type : skin'));
            }
        } else
            message.reply('That item does not exist?');
    },
};
