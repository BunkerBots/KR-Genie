import db from '../../modules/db/economy.js';
import data from '../../data/index.js';
import * as items from '../../data/items.js';
import { MessageEmbed } from 'discord.js';
import { addXP } from '../../modules/db/levels.js';
import { createEmbed } from '../../modules/messageUtils.js';


export default {
    name: 'infect',
    cooldown: 10800, // cooldown in ms
    aliases: ['infect'],
    description: `Do you have ${data.emotes.krunkitis} Krunkitis? Do your part and infect healthy users using this command`,
    expectedArgs: 'k/infect (ID / @user)',
    manualStamp: true,
    execute: async(message, args) => {
        const krunkitis = await db.utils.krunkitis(message.author.id);
        if (krunkitis == false) return message.reply(createEmbed(message.author, 'RED', `You dont have ${data.emotes.krunkitis}`));
        const skinsarr = [];
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Who are you infecting?'));
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.reply(createEmbed(message.author, 'RED', 'Unknown user'));
        const userKrunkitis = await db.utils.krunkitis(target.id);
        if (userKrunkitis == true) return message.reply(createEmbed(message.author, 'RED', `${target.username} is already infected ${data.emotes.krunkitis}`));
        const dupes = new Map();
        const inv = (await db.utils.itemInventory(target.id)).map(x => items.items[x])
            .filter(x => {
                const count = dupes.get(x.id) || 0;
                dupes.set(x.id, count + 1);
                return !count;
            });
        for (const item of inv)
            skinsarr.push(item.id);
        let color, description, footer;
        if (skinsarr.includes(parseInt(2))) {
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
        message.reply({ embeds: [new MessageEmbed()
            .setColor(color)
            .setDescription(description)
            .setFooter(footer)
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))] });
        addXP(message.author.id, 23, message);
        message.timestamps.set(message.author.id, Date.now());
    },
};
