import { MessageEmbed } from 'discord.js';
import { emotes } from '../../data/index.js';
import items from '../../data/items.js';
import comma from '../../modules/comma.js';
import core from '../../data/JSON/core.json';
import Paginator from '../paginator.js';


export default {
    name: 'collect',
    aliases: ['collectables', 'collectable'],
    cooldown: 3,
    description: 'Shows the list of all purchasable collectables',
    expectedArgs: 'k/collect',
    execute: async(message, args, bot) => {
        const sortedArr = items.sort((a, b) => b.price - a.price);
        const values = sortedArr;
        const max = Math.ceil(values.length / 10);
        const options = { author: message.author, current: 1, maxValues: values.length, max: max };
        // thiss is an arr ['collectable name']
        const paginator = new Paginator(bot, message.channel, options, async(index, dat) => {
            const res = values.slice(index, index + 10);
            const embed = new MessageEmbed()
                .setAuthor('KR Collectables')
                .setDescription('These items do not have any particular use except flexing on your normie friends\n\u200b')
                .setColor(core.embed)
                .setFooter(`${dat.page} out of ${max}`);
            for (const g of res) embed.addField(`${g.icon} ${g.name} : ${emotes.kr}${comma(g.price)}`, `${g.description}\n\u200b`);
            return { embeds: [embed] };
        });
        await paginator.start();
    },
};
