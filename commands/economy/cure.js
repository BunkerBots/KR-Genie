const db = require('../../modules');
const data = require('../../data');
const skins = require('../../modules/skins');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'cure',
    aliases: ['treat'],
    cooldown: 21600,
    description: 'A dangerous virus is on the loose! Cure infected users using the antidote! (An item in the shop. Use the shop command for more information)',
    expectedArgs: 'k/cure (ID / @user)',
    execute: async(message, args) => {
        const skinsarr = [];
        const dupes = new Map();
        const inventory = (await db.utils.skinInventory(message.author.id)).map(x => skins.allSkins[x]).sort((a, b) => a.rarity - b.rarity).reverse()
            .filter(x => {
                const count = dupes.get(x.index) || 0;
                dupes.set(x.index, count + 1);
                return !count;
            });
        for (const skin of inventory)
            skinsarr.push(skin.index);
        if (!skinsarr.includes(1659)) return message.reply('You do not own `antidote xvi` to cure infected users!');
        if (!args[0]) return message.reply('Who are you curing?');
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        const userKrunkitis = await db.utils.krunkitis(target.id);
        if (userKrunkitis == false) return message.reply(`${target.username} is not infected`);
        await db.utils.cure(target.id);
        message.channel.send(new MessageEmbed()
            .setDescription(`${message.author.username} cured ${target.username} ${data.emotes.krunkitis}`)
            .setFooter('krunker doctor™'));
    },
};
