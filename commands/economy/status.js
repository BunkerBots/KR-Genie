const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const totalSkins = require('../../data/skins');
const db = require('../../modules');
const Skins = require('../../modules/skins');
module.exports = {
    name: 'status',
    aliases: ['stats', 'stat'],
    execute: async(message, args) => {
        const sortedRarities = [];
        const userSortedRarities = [];
        const dupes = new Map();
        const userDupes = new Map();
        const spinCount = await db.utils.skinInventory(message.author.id);
        const Inventory = (await db.utils.skinInventory(message.author.id)).map(x => Skins.allSkins[x]).sort((a, b) => a.rarity - b.rarity).reverse()
            .filter(x => {
                const count = dupes.get(x.index) || 0;
                dupes.set(x.index, count + 1);
                return !count;
            });
        if (!args[0]) {
            const rarityArr = [new Object()];
            for (const skin of Inventory) {
                // skin = Skins.allSkins[skin];
                rarityArr.push({ rarity: skin.rarity });
            }
            for (let i = 0; i < 7; i++)
                sortedRarities[i] = rarityArr.filter(x => x.rarity == i);
            message.channel.send(new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle(`${message.author.username}'s Economy Stats`)
                .setDescription(`Total spins : \`${spinCount.length}\`\nSkins collected : \`${Inventory.length}/${totalSkins.length}\``)
                .addField(`${data.emotes.unobtainable} Unobtainables:`, `${sortedRarities[6].length || 0}`)
                .addField(`${data.emotes.contraband} Contrabands:`, `${sortedRarities[5].length || 0}`)
                .addField(`${data.emotes.relic} Relics:`, `${sortedRarities[4].length || 0}`)
                .addField(`${data.emotes.legendary} Legendaries`, `${sortedRarities[3].length || 0}`)
                .addField(`${data.emotes.epic} Epics:`, `${sortedRarities[2].length || 0}`)
                .addField(`${data.emotes.rare} Rares:`, `${sortedRarities[1].length || 0}`)
                .setFooter('Collect all the skins for a reward!'),
            );
            return;
        }

        const target = message.client.users.fetch(args[0].replace(/\D/g, ''));
        try {
            await target;
        } catch (e) {
            message.channel.send('Unknown user');
        }
        target.then(async user => {
            const userSpinCount = await db.utils.skinInventory(user.id);
            const userInventory = (await db.utils.skinInventory(user.id)).map(x => Skins.allSkins[x]).sort((a, b) => a.rarity - b.rarity).reverse()
                .filter(x => {
                    const count = userDupes.get(x.index) || 0;
                    userDupes.set(x.index, count + 1);
                    return !count;
                });
            const userRarityArr = [new Object()];
            for (const skin of userInventory) {
                // skin = Skins[skin];
                userRarityArr.push({ rarity: skin.rarity });
            }
            for (let i = 0; i < 7; i++)
                userSortedRarities[i] = userRarityArr.filter(x => x.rarity == i);
            message.channel.send(new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle(`${user.username}'s Economy Stats`)
                .setDescription(`Total spins : \`${userSpinCount.length}\`\nSkins collected : \`${userInventory.length}/${totalSkins.length}\``)
                .addField(`${data.emotes.unobtainable} Unobtainables:`, `${userSortedRarities[6].length || 0}`)
                .addField(`${data.emotes.contraband} Contrabands:`, `${userSortedRarities[5].length || 0}`)
                .addField(`${data.emotes.relic} Relics:`, `${userSortedRarities[4].length || 0}`)
                .addField(`${data.emotes.legendary} Legendaries`, `${userSortedRarities[3].length || 0}`)
                .addField(`${data.emotes.epic} Epics:`, `${userSortedRarities[2].length || 0}`)
                .addField(`${data.emotes.rare} Rares:`, `${userSortedRarities[1].length || 0}`)
                .setFooter('Collect all the skins for a reward'),
            );
        });
    },
};
