import db from '../../modules/db/economy.js';
import { InventoryParser } from '../../modules/index.js';
import Paginator from '../../modules/paginator.js';
import { MessageEmbed } from 'discord.js';
import { createEmbed } from '../../modules/messageUtils.js';
import { core } from '../../data/index.js';

export default {
    name: 'inventory',
    aliases: ['inv'],
    cooldown: 5,
    description: 'Displays the items owned by an user',
    expectedArgs: 'k/inventory [ID / @user]',
    execute: async(message, args, bot) => {
        let user;
        if (!args[0] || (Number.isInteger(parseInt(args[0])) && args[0].length < 5))
            user = message.author;
        else {
            const target = await message.client.users.fetch(args.shift().replace(/\D/g, '')).catch(() => {});
            if (!target) return message.reply(createEmbed(message.author, 'RED', 'No user found!'));
            else user = target;
        }
        const data = await db.utils.itemInventory(user.id);
        const parser = new InventoryParser(data);
        const toolsArr = await parser.parseItems();
        const lastPage = Math.ceil(toolsArr.length / 10);
        const options = { author: message.author, current: 1, maxValues: toolsArr.length, max: lastPage };
        // thiss is an arr ['collectable name']
        const paginator = new Paginator(bot, message.channel, options, async(i, dat) => {
            const final = [...toolsArr].slice(i, i + 10);
            return { embeds: [new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
                .setFooter(`${dat.page} out of ${lastPage}`)
                .setTitle(`${user.username}'s skins`)
                .setColor(core.embed)
                .setDescription(final.join('\n\u200b\n'))] }; // return embed
        });
        await paginator.start();
    },
};
