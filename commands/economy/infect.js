const db = require('../../modules');
const data = require('../../data');
const skins = require('../../modules/skins');
const { MessageEmbed } = require('discord.js'),
    levels = require('../../mongo');
module.exports = {
    name: 'infect',
    cooldown: 10800, // cooldown in ms
    aliases: ['infect'],
    description: `Do you have ${data.emotes.krunkitis} Krunkitis? Do your part and infect healthy users using this command`,
    expectedArgs: 'k/infect (ID / @user)',
    manualStamp: true,
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
        let color, description, footer;
        if (skinsarr.includes(parseInt(944))) {
            const finedKR = Math.floor(Math.random() * 2000);
            color = 'RED',
            description = `You tried infecting ${target.username} only to realize they had a facemask. You got fined ${data.emotes.kr}${finedKR}`,
            footer = 'sucks to suck';
            await db.utils.addKR(message.author.id, -parseInt(finedKR));
        } else {
            await db.utils.infect(target.id);
            color = 'GREEN',
            description = `${message.author.username} infected ${target.username} ${data.emotes.krunkitis}`,
            footer = 'SMH should have bought a face mask';
        }
        message.channel.send(new MessageEmbed()
            .setColor(color)
            .setDescription(description)
            .setFooter(footer)
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false })));
        levels.addXP(message.author.id, 23, message);
        message.timestamps.set(message.author.id, Date.now());
    },
};

