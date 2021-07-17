// eslint-disable-next-line no-unused-vars
import { MessageEmbed } from 'discord.js';
import comma from '../../modules/comma.js';
import { emotes } from '../../data/index.js';
import * as items from '../../data/items.js';
import * as core from '../../data/JSON/core.json';import { createEmbed } from '../../modules/messageUtils.js';


export default {
    name: 'item',
    aliases: ['iteminfo'],
    cooldown: 10,
    description: 'Get information regarding a specific item/collectable',
    expectedArgs: 'k/item (item name)',
    execute: async(message, args) => {
        if (!args[0]) return message.reply('You need to provide an item name lmao');
        const arg = args.join(' ').toLowerCase();
        const allitems = items.collectables.concat(items.items);
        const found = allitems.find(x => x.name.toLowerCase() === arg);
        if (found) {
            const types = [
                ['i', `${found.description}\n\u200b\n**Buy :** ${emotes.kr}${comma(found.price)}\n**Sell :** coming soon`, 'tool'],
                ['b', `${found.description}\n**Buy :** ${emotes.kr}${comma(found.price)}\n**Sell :** Badges cannot be sold`, 'badge'],
                ['s', `${found.description}\n**Buy :** ${emotes.kr}${comma(found.price)}`, 'skin'],
                ['c', `${found.description}\n**Buy :** ${emotes.kr}${comma(found.price)}\n**Sell :** Collectables cannot be sold`, 'collectable']
            ];
            const type = types.find(x => x[0] === found.type);
            if (!type) return;
            message.channel.send(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`${found.icon} ${found.name}`)
                .setColor(core.embed)
                .setDescription(type[1])
                .setFooter(`Item type : ${type[2]}`));
        } else
            message.reply(createEmbed(message.author, 'RED', 'That item does not exist?'));
    },
};
