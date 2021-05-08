/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');
const data = require('../../data'),
    devs = data.devs,
    beta = data.testers;
// eslint-disable-next-line no-unused-vars
const totalSkins = require('../../data/skins'); // test
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
        // if (!beta.includes(message.author.id)) return message.reply(createEmbed(message.author, 'RED', 'This command is temporarily disabled following some bugs'));
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'What rarity are you selling?'));
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
        const rates = [1, 25, 150, 500, 2500, 10000, 100000];
        const parseRarity = (str) => {
            if (['unobtainables'].includes(str.toLowerCase())) return [6, 'unobtainables'];
            else if (['contraband', 'contrabands', 'contra'].includes(str.toLowerCase())) return [5, 'contrabands'];
            else if (['relic', 'relics'].includes(str.toLowerCase())) return [4, 'relics'];
            else if (['legendary', 'legendaries'].includes(str.toLowerCase())) return [3, 'legendaries'];
            else if (['epic', 'epics'].includes(str.toLowerCase())) return [2, 'epics'];
            else if (['rare', 'rares'].includes(str.toLowerCase())) return [1, 'rares'];
            else if (['uncommon', 'uncommons'].includes(str.toLowerCase())) return [0, 'uncommons'];
            else return 'Unknown rarity';
        };
        const rarity = parseRarity(args[0]);
        if (rarity == 'Unknown rarity') return message.reply(createEmbed(message.author, 'RED', 'Unknown rarity'));
        const price = rates[rarity[0]];
        const totalPrice = parseInt(price * sortedRaritiesCount[rarity[0]].length);
        for (const skin of sortedRarities[rarity[0]]) {
            console.log(sortedRarities[rarity[0]]);
            const index = user.inventory.skins.findIndex(i => i === skin.index);
            user.inventory.skins[index] = null;
            user.balance.bank += parseInt(price * skin.count);
        }
        user.inventory.skins.filter(x => x);
        await db.set(message.author.id, user);
        message.reply(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Sold ${sortedRaritiesCount[rarity[0]].length} ${rarity[1]} for ${data.emotes.kr}${totalPrice}`)
            .setColor('GREEN'));
    },
};
