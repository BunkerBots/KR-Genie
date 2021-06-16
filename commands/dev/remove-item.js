// eslint-disable-next-line no-unused-vars
import { MessageEmbed } from 'discord.js';
import db from '../../modules/db/economy.js';
import { devs, staff } from '../../data/index.js';
import * as items from '../../data/items.js';
import { createEmbed } from '../../modules/messageUtils.js';


export default {
    name: 'removeitem',
    aliases: ['delitem'],
    cooldown: 10,
    description: 'A command used to buy items/collectables/skins from the shop',
    expectedArgs: 'k/buy (item name)',
    manualStamp: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
            return;
        if (!args[0])
            return message.reply(createEmbed(message.author, 'RED', 'Whose items are you removing'));
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
        if (!target)
            return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        const user = await db.utils.get(target.id);
        const arg = args.splice(1).join(' ').toLowerCase();
        const combinedArr = items.collectables.concat(items.items);
        const found = combinedArr.find(x => x.name.toLowerCase() === arg);
        if (found) {
            if (found == undefined)
                return message.channel.send(createEmbed(message.author, 'RED', 'Unknown item'));
            if (found.type === 'c') {
                const index = user.inventory.collectables.findIndex(x => x === found.id);
                if (index == -1) // If skin not found
                    return message.reply(createEmbed(message.author, 'RED', `${target.username} doesn't have that skin!`));
                user.inventory.collectables.splice(index, 1);
                await db.set(target.id, user);
            } else if (found.type === 'i') {
                const index = user.inventory.items.findIndex(x => x === found.id);
                if (index == -1) // If skin not found
                    return message.reply(createEmbed(message.author, 'RED', `${target.username} doesn't have that skin!`));
                user.inventory.items.splice(index, 1);
                await db.set(target.id, user);
            }
            message.channel.send(new MessageEmbed()
                .setColor('GREEN')
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(`Removed ${found.name} from ${target.username}`));
        } else
            message.reply(createEmbed(message.author, 'RED', 'That item does not exist?'));

        message.timestamps.set(message.author.id, Date.now());
    }
};

