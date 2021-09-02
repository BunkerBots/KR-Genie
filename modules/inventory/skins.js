import db from '../db/economy.js';
import { InventoryParser } from '../index.js';
import Paginator from '../paginator.js';
import { MessageEmbed } from 'discord.js';
import { createEmbed } from '../messageUtils.js';
import { core } from '../../data/index.js';

export default {
    name: 'skins',
    execute: async(message, args, bot) => {
        let user;
        if (!args[0] || (Number.isInteger(parseInt(args[0])) && args[0].length < 5))
            user = message.author;
        else {
            const target = await message.client.users.fetch(args.shift().replace(/\D/g, '')).catch(() => {});
            if (!target) return message.reply(createEmbed(message.author, 'RED', 'No user found!'));
            else user = target;
        }
        const data = await db.utils.skinInventory(user.id);
        const parser = new InventoryParser(data);
        const skinsArr = await parser.parseSkins();
        const lastPage = Math.ceil(skinsArr.length / 10);
        const options = { author: message.author, current: 1, maxValues: skinsArr.length, max: lastPage };
        // thiss is an arr ['collectable name']
        const paginator = new Paginator(bot, message.channel, options, async(i, dat) => {
            const final = [...skinsArr].slice(i, i + 10);
            return { embeds: [new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
                .setFooter(`${dat.page} out of ${lastPage == 0 ? 1 : lastPage}`)
                .setTitle(`${user.username}'s skins`)
                .setColor(core.embed)
                .setDescription(final.join('\n\u200b\n'))] }; // return embed
        });
        await paginator.start();
    },
};
