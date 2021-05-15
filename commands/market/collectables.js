import { MessageEmbed } from 'discord.js';
import { emotes } from '../../data/index.js';
import items from '../../data/items';
import comma from '../../modules/comma';
import * as core from '../../data/JSON/core.json';

module.exports = {
    name: 'collect',
    aliases: ['collectables', 'collectable'],
    cooldown: 3,
    description: 'Shows the list of all purchasable collectables',
    expectedArgs: 'k/collect',
    execute: async(message, args) => {
        let footer;
        let pageNumber;
        const sortedArr = items.sort((a, b) => a.price - b.price).reverse();
        /**
         * Creates an embed with items starting from an index.
         * @param {number} start The index to start from.
         */
        const generateEmbed = start => {
            const current = sortedArr.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor('Collectables')
                .setColor(core.embed)
                .setDescription('These items do not have any particular use except flexing on your normie friends\n\u200b')
                .setFooter(footer);
            current.forEach(g => embed.addField(`${g.icon} ${g.name} : ${emotes.kr}${comma(g.price)}`, `${g.description}\n\u200b`));
            return embed;
        };
        if (items.length < 10) {
            footer = '1 out of 1';
            message.channel.send(generateEmbed(0));
            return;
        }

        const page = args.shift();
        if (!page) {
            const lastPage = Math.ceil(items.length / 10);
            footer = `1 out of ${lastPage}`;
            message.channel.send(generateEmbed(0));
        } else {
            if (isNaN(page)) return;
            const lastPage = Math.ceil(items.length / 10);
            footer = `${page} out of ${lastPage}`;
            pageNumber = page - 1;
            const currentindex = parseInt(pageNumber * 10);
            console.log(currentindex);
            if (currentindex > items.length) return;
            message.channel.send(generateEmbed(currentindex));
        }
    },
};
