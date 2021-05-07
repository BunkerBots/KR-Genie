const { MessageEmbed } = require('discord.js');
const data = require('../../data');
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
        console.log(user.inventory.skins);
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
        const { rarity } = resolveRarity(args[0]);
        sortedRarities[rarity].forEach(async skin => {
            const index = user.inventory.skins.findIndex(i => i === skin.index);
            user.inventory.skins.splice(index, skin.count);
            user.balance.bank += parseInt(10000 * skin.count);
            await db.set(message.author.id, user);
        });
        const price = parseInt(10000 * sortedRaritiesCount[rarity].length);
        message.reply(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Sold ${sortedRaritiesCount[rarity].length} Contrabands for ${data.emotes.kr}${price}`)
            .setColor('GREEN'));
    },
};
