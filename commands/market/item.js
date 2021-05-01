// eslint-disable-next-line no-unused-vars
const { MessageEmbed } = require('discord.js'),
    comma = require('../../modules/comma'),
    emotes = require('../../data').emotes,
    items = require('../../data/items'),
    core = require('../../data/JSON/core.json');

module.exports = {
    name: 'item',
    aliases: ['iteminfo'],
    cooldown: 10,
    description: 'Get information regarding a specific item/collectable',
    expectedArgs: 'k/item (item name)',
    execute: async(message, args) => {
        if (!args[0]) return message.reply('You need to provide an item name lmao');
        const arg = args.join(' ').toLowerCase();
        const allitems = items.concat(items.items);
        const found = allitems.find(x => x.name.toLowerCase() === arg);
        if (found) {
            if (found.type === 'i') {
                message.channel.send(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle(`${found.icon} ${found.name}`)
                    .setColor(core.embed)
                    .setDescription(`${found.description}\n\u200b\n**Buy :** ${emotes.kr}${comma(found.price)}\n**Sell :** Collectables cannot be sold`)
                    .setFooter('Item type : tool'));
            } else if (found.type === 'b') {
                message.channel.send(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle(`${found.icon} ${found.name}`)
                    .setColor(core.embed)
                    .setDescription(`${found.description}\n**Buy :** ${emotes.kr}${comma(found.price)}\n**Sell :** Badges cannot be sold`)
                    .setFooter('Item type : badge'));
            } else if (found.type === 's') {
                message.channel.send(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle(`${found.icon} ${found.name}`)
                    .setColor(core.embed)
                    .setDescription(`${found.description}\n**Buy :** ${emotes.kr}${comma(found.price)}`)
                    .setFooter('Item type : skin'));
            } else if (found.type === 'c') {
                message.channel.send(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle(`${found.icon} ${found.name}`)
                    .setColor(core.embed)
                    .setDescription(`${found.description}\n**Buy :** ${emotes.kr}${comma(found.price)}\n**Sell :** Collectables cannot be sold`)
                    .setFooter('Item type : collectable'));
            }
        } else
            message.reply('That item does not exist?');
    },
};
