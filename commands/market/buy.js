// eslint-disable-next-line no-unused-vars
import { MessageEmbed } from 'discord.js';
import comma from '../../modules/comma.js';
import db from '../../modules/db.js';
import { emotes } from '../../data/index.js';
import items from '../../data/items.js';
import { createEmbed } from '../../modules/messageUtils.js';


module.exports = {
    name: 'buy',
    aliases: ['cop', 'purchase'],
    cooldown: 10,
    description: 'A command used to buy items/collectables/skins from the shop',
    expectedArgs: 'k/buy (item name)',
    manualStamp: true,
    execute: async(message, args) => {
        const premium = await db.utils.premium(message.author.id);
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'What are you buying lmao'));
        const { wallet } = await db.utils.balance(message.author.id);
        if (wallet <= 0) return message.reply(createEmbed(message.author, 'RED', 'You can\'t even get thin air for an empty wallet smh'));
        const arg = args.join(' ').toLowerCase();
        const combinedArr = items.concat(items.items);
        const found = combinedArr.find(x => x.name.toLowerCase() === arg);
        if (found) {
            if (wallet < found.price) return message.reply(createEmbed(message.author, 'RED', `You do not have ${emotes.kr}${comma(found.price)} in your wallet!`));
            if (found.type === 'c') {
                await db.utils.addCollectable(message.author.id, found.id);
                await db.utils.addKR(message.author.id, -parseInt(found.price));
            } else if (found.type === 'b') {
                if (premium == true) return message.reply(createEmbed(message.author, 'RED', 'Lmao you can\'t own multiple badges'));
                await db.utils.addKR(message.author.id, -parseInt(found.price));
                await db.utils.getPremium(message.author.id);
            } else if (found.type === 's') {
                await db.utils.addKR(message.author.id, -parseInt(found.price));
                await db.utils.addSkin(message.author.id, found.index);
            } else if (found.type === 'i') {
                await db.utils.addKR(message.author.id, -parseInt(found.price));
                await db.utils.addItem(message.author.id, parseInt(found.id));
            }
            message.channel.send(new MessageEmbed()
                .setColor('GREEN')
                .setAuthor(`Successfully purchased ${found.name}`, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`<@${message.author.id}> bought **${found.icon} ${found.name}** and paid ${emotes.kr}${comma(found.price)}`)
                .setFooter('Thank you for the purchase!'));
        } else
            message.reply(createEmbed(message.author, 'RED', 'That item does not exist?'));
        message.timestamps.set(message.author.id, Date.now());
    },
};
