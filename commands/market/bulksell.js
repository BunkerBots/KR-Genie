const { MessageEmbed } = require('discord.js');
const data = require('../../data');
// eslint-disable-next-line no-unused-vars
const totalSkins = require('../../data/skins');
const db = require('../../modules');
const Skins = require('../../modules/skins'),
    { createEmbed } = require('../../modules/messageUtils');
module.exports = {
    name: 'bulksell',
    aliases: ['bsell'],
    cooldown: 3,
    description: 'Sell skins based on rarities',
    expectedArgs: 'k/bulksell [rarity]',
    execute: async(message, args) => {
        const sortedRarities = [];
        const sortedRaritiesCount = [];
        const user = await db.utils.get(message.author.id);
        const dupes = new Map();
        const skincount = [new Object()];
        const Inventory = (await db.utils.skinInventory(message.author.id)).map(x => Skins.allSkins[x]).sort((a, b) => a.rarity - b.rarity).reverse()
            .filter(x => {
                const count = dupes.get(x.index) || 0;
                dupes.set(x.index, count + 1);
                return !count;
            });
        const InventoryCount = (await db.utils.skinInventory(message.author.id)).map(x => Skins.allSkins[x]).sort((a, b) => a.rarity - b.rarity).reverse();
        for (const skin of InventoryCount)
            skincount.push({ rarity: skin.rarity });

        for (let i = 0; i < 7; i++)
            sortedRaritiesCount[i] = skincount.filter(x => x.rarity == i);
        const rarityArr = [new Object()];
        for (const skin of Inventory) {
            const count = dupes.get(skin.index);
            rarityArr.push({ rarity: skin.rarity, index: skin.index, count: count == 1 ? 1 : count });
        }
        for (let i = 0; i < 7; i++)
            sortedRarities[i] = rarityArr.filter(x => x.rarity == i);
        if (['contraband', 'contrabands', 'contra'].includes(args[0].toLowerCase())) {
            sortedRarities[5].forEach(async skin => {
                const index = user.inventory.skins.findIndex(i => i === skin.index);
                user.inventory.skins.splice(index, skin.count);
                user.balance.wallet += parseInt(10000 * skin.count);
                await db.set(message.author.id, user);
            });
            const price = parseInt(10000 * sortedRaritiesCount[5].length);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sold ${sortedRaritiesCount[5].length} Contrabands for ${data.emotes.kr}${price}`)
                .setColor('GREEN'));
        } else if (['relic', 'relics'].includes(args[0].toLowerCase())) {
            sortedRarities[4].forEach(async skin => {
                const index = user.inventory.skins.findIndex(i => i === skin.index);
                user.inventory.skins.splice(index, skin.count);
                user.balance.wallet += parseInt(2500 * skin.count);
                await db.set(message.author.id, user);
            });
            const price = parseInt(2500 * sortedRaritiesCount[4].length);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sold ${sortedRaritiesCount[4].length} Relics for ${data.emotes.kr}${price}`)
                .setColor('GREEN'));
        } else if (['legendary', 'legendaries'].includes(args[0].toLowerCase())) {
            sortedRarities[3].forEach(async skin => {
                const index = user.inventory.skins.findIndex(i => i === skin.index);
                user.inventory.skins.splice(index, skin.count);
                user.balance.wallet += parseInt(500 * skin.count);
                await db.set(message.author.id, user);
            });
            const price = parseInt(500 * sortedRaritiesCount[3].length);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sold ${sortedRaritiesCount[3].length} Legendaries for ${data.emotes.kr}${price}`)
                .setColor('GREEN'));
        } else if (['epic', 'epics'].includes(args[0].toLowerCase())) {
            sortedRarities[2].forEach(async skin => {
                const index = user.inventory.skins.findIndex(i => i === skin.index);
                user.inventory.skins.splice(index, skin.count);
                user.balance.wallet += parseInt(150 * skin.count);
                await db.set(message.author.id, user);
            });
            const price = parseInt(150 * sortedRaritiesCount[2].length);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sold ${sortedRaritiesCount[2].length} Epics for ${data.emotes.kr}${price}`)
                .setColor('GREEN'));
        } else if (['rares', 'rare'].includes(args[0].toLowerCase())) {
            sortedRarities[1].forEach(async skin => {
                const index = user.inventory.skins.findIndex(i => i === skin.index);
                user.inventory.skins.splice(index, skin.count);
                user.balance.wallet += parseInt(25 * skin.count);
                await db.set(message.author.id, user);
            });
            const price = parseInt(25 * sortedRaritiesCount[1].length);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sold ${sortedRaritiesCount[1].length} Rares for ${data.emotes.kr}${price}`)
                .setColor('GREEN'));
        } else
            message.reply(createEmbed(message.author, 'RED', 'unknown rarity'));
    },
};
