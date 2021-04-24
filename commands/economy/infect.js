const db = require('../../modules');
const data = require('../../data');
const skins = require('../../modules/skins');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'infect',
    cooldown: 3600,
    execute: async(message, args) => {
        const krunkitis = await db.utils.krunkitis(message.author.id);
        if (krunkitis == false) return message.reply(`You dont have ${data.emotes.krunkitis}`);
        const skinsarr = [];
        if (!args[0]) return message.reply('Who are you infecting?');
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        const userKrunkitis = await db.utils.krunkitis(target.id);
        if (userKrunkitis == true) return message.reply(`${target.username} is already infected ${data.emotes.krunkitis}`);
        const dupes = new Map();
        const inventory = (await db.utils.skinInventory(target.id)).map(x => skins.allSkins[x]).sort((a, b) => a.rarity - b.rarity).reverse()
            .filter(x => {
                const count = dupes.get(x.index) || 0;
                dupes.set(x.index, count + 1);
                return !count;
            });
        for (const skin of inventory)
            skinsarr.push(skin.index);

        if (skinsarr.includes(parseInt(944))) {
            const finedKR = Math.floor(Math.random() * 2000);
            message.reply(`You tried to infect ${target.username} but then you realized they had a facemask and you got fined ${data.emotes.kr}${parseInt(finedKR)}`);
            await db.utils.addKR(message.author.id, -parseInt(finedKR));
            return;
        }
        await db.utils.infect(target.id);
        message.channel.send(new MessageEmbed()
            .setDescription(`${message.author.username} infected ${target.username} ${data.emotes.krunkitis}`)
            .setFooter('SMH should have bought a facemask'));
    },
};
