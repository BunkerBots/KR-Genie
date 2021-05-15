import db from '../../modules/db.js';
import data from '../../data/index.js';
import items from '../../data/items.js';
import { MessageEmbed } from 'discord.js';
import levels from '../../mongo/index.js';
import { createEmbed } from '../../modules/messageUtils.js';

export default {
    name: 'cure',
    aliases: ['treat'],
    cooldown: 21600,
    description: 'A dangerous virus is on the loose! Cure infected users using the antidote! (An item in the shop. Use the shop command for more information)',
    expectedArgs: 'k/cure (ID / @user)',
    manualStamp: true,
    execute: async(message, args) => {
        const skinsarr = [];
        const dupes = new Map();
        const inv = (await db.utils.itemInventory(message.author.id)).map(x => items.items[x])
            .filter(x => {
                const count = dupes.get(x.id) || 0;
                dupes.set(x.id, count + 1);
                return !count;
            });
        for (const item of inv)
            skinsarr.push(item.id);
        if (!skinsarr.includes(3)) return message.reply(createEmbed(message.author, 'RED', 'You do not own `antidote xvi` to cure infected users!'));
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Who are you curing?'));
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        const userKrunkitis = await db.utils.krunkitis(target.id);
        if (userKrunkitis == false) return message.reply(createEmbed(message.author, 'RED', `${target.username} is not infected`));
        await db.utils.cure(target.id);
        message.channel.send(new MessageEmbed()
            .setDescription(`${message.author.username} cured ${target.username} ${data.emotes.krunkitis}`)
            .setFooter('krunker doctor™'));
        levels.addXP(message.author.id, 23, message);
        message.timestamps.set(message.author.id, Date.now());
    },
};
