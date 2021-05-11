/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const data = require('../../data'),
    devs = data.devs,
    beta = data.testers;
const db = require('../../modules');
const Skins = require('../../modules/skins'),
    { createEmbed } = require('../../modules/messageUtils'),
    { resolveRarity } = require('../../modules/utils');
module.exports = {
    name: 'bulksell',
    aliases: ['bsell'],
    cooldown: 3,
    description: 'Sell skins based on rarities',
    expectedArgs: 'k/bulksell [rarity]',
    execute: async(message, args) => {
        // if (!devs.includes(message.author.id)) return message.reply(createEmbed(message.author, 'RED', 'This command is temporarily disabled following some bugs'));
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'What rarity are you selling?'));
        const rarity = resolveRarity(args[0]);
        if (rarity === undefined) return message.reply(createEmbed(message.author, 'RED', 'Unknown rarity'));
        const user = await db.utils.get(message.author.id);
        let rarityCount = 0;
        user.inventory.skins = user.inventory.skins.map(x => Skins.allSkins[x]).sort((a, b) => a.rarity - b.rarity).reverse()
            .filter(x => {
                if (x.rarity == rarity) {
                    rarityCount += 1;
                    return false;
                }
                return true;
            }).map(x => x.index);
        const rates = [1, 25, 150, 500, 2500, 10000, 100000];
        const price = rates[rarity];
        const totalPrice = parseInt(price * rarityCount);
        user.balance.bank += totalPrice;
        console.log(user);
        await db.set(message.author.id, user);
        message.reply(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Sold ${rarityCount} ${Skins.textColorParse(rarity)} for ${data.emotes.kr}${totalPrice}`)
            .setColor('GREEN'));
    },
};
