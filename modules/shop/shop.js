import { MessageEmbed } from 'discord.js';
import { emotes } from '../../data/index.js';
import * as items from '../../data/items.js';
import comma from '..//comma.js';
import core from '../../data/JSON/core.json';
import Paginator from '../paginator.js';
export default {
    name: 'shop',
    aliases: ['market'],
    cooldown: 5,
    description: 'A place where you can purchase various useful items',
    expectedArgs: 'k/shop',
    execute: async(message, args, bot) => {
        const values = items.items.sort((a, b) => b.price - a.price);
        const max = Math.ceil(values.length / 10);
        const options = { author: message.author, current: 1, maxValues: values.length, max: max };
        // thiss is an arr ['collectable name']
        const paginator = new Paginator(bot, message.channel, options, async(index, dat) => {
            const res = values.slice(index, index + 10);
            const embed = new MessageEmbed()
                .setAuthor('KR Market')
                .setDescription(`A place to spend your ${emotes.kr} and get useful items\n\u200b`)
                .setColor(core.embed)
                .setFooter(`${dat.page} out of ${max}`);
            for (const g of res) embed.addField(`${g.icon} ${g.name} : ${emotes.kr}${comma(g.price)}`, `${g.description}\n\u200b`);
            return { embeds: [embed] };
        });
        await paginator.start();
    },
};
