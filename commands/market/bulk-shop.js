// eslint-disable-next-line no-unused-vars
import { MessageEmbed } from 'discord.js';
import comma from '../../modules/comma.js';
import db from '../../modules/db/economy.js';
import { emotes } from '../../data/index.js';
import * as items from '../../data/items.js';
import { createEmbed } from '../../modules/messageUtils.js';


export default {
    name: 'bulkshop',
    aliases: ['bulkcop', 'bshop'],
    cooldown: 20,
    description: 'A command used to buy a number of items/collectables/skins from the shop in one go',
    expectedArgs: 'k/buy (amount) (item name)',
    manualStamp: true,
    execute: async(message, args) => {
        const premium = await db.utils.premium(message.author.id);
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'How many item are you buying?'));
        if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'Lol you need to provide an item name'));
        if (args[0] <= 0) return message.reply(createEmbed(message.author, 'RED', 'What, are you trying to break me?'));
        if (isNaN(args[0])) return message.reply(createEmbed(message.author, 'RED', 'Provide a valid number of items that you want to buy'));
        if (args[0] > 100) return message.reply(createEmbed(message.author, 'RED', 'Hold on now, you can only buy 100 items in one go'));
        const { wallet } = await db.utils.balance(message.author.id);
        if (wallet <= 0) return message.reply(createEmbed(message.author, 'RED', 'You can\'t even get thin air for an empty wallet smh'));
        const arg = args.splice(1).join(' ').toLowerCase();
        const combinedArr = items.default.concat(items.items);
        const found = combinedArr.find(x => x.name.toLowerCase() === arg);
        if (found) {
            if (wallet < parseInt(found.price * args[0])) return message.reply(createEmbed(message.author, 'RED', `You do not have ${emotes.kr}${comma(found.price * args[0])} in your wallet!`));
            for (let i = 0; i < parseInt(args[0]); i++) {
                const types = [
                    ['c', async(id) => await db.utils.addCollectable(message.author.id, id)],
                    ['b', async() => await db.utils.getPremium(message.author.id)],
                    ['s', async(id) => await db.utils.addSkin(message.author.id, id)],
                    ['i', async(id) => await db.utils.addItem(message.author.id, id)]
                ];
                const type = types.find(x => x[0] === found.type);
                if (!type) return;
                if (type[0] === 'b' && premium) return message.reply(createEmbed(message.author, 'RED', 'Lmao you can\'t own multiple badges'));
                const id = type[0] === 's' ? found.index : found.id;
                await type[1](parseInt(id));
                await db.utils.addKR(message.author.id, -parseInt(found.price));
            }
            message.reply({ embeds: [new MessageEmbed()
                .setColor('GREEN')
                .setAuthor(`Successfully purchased ${found.name}`, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`<@${message.author.id}> bought ${args[0]} **${found.icon} ${found.name}** and paid ${emotes.kr}${comma(found.price * args[0])}`)
                .setFooter('Thank you for the purchase!')] });
        } else
            message.reply(createEmbed(message.author, 'RED', 'That item does not exist?'));

        message.timestamps.set(message.author.id, Date.now());
    },
};
