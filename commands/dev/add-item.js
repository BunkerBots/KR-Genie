import { devs, staff } from '../../data/index.js';
import { commandsLog } from '../../modules/logger.js';
import { items as _items } from '../../data/items.js';
import { utils } from '../../modules/db.js';
import { createEmbed } from '../../modules/messageUtils.js';


export default {
    name: 'additem',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
            return;
        if (!args[0])
            return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
        if (!target)
            return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        args.shift();
        const item = args.join(' ').toLowerCase();
        const found = await _items.find(x => x.name.toLowerCase() == item);
        if (found == undefined)
            return message.channel.send(createEmbed(message.author, 'RED', 'Unknown item'));
        await utils.addItem(target.id, found.id);
        message.channel.send(`Successfully added \`${item}\` to \`${target.username}\``);
        commandsLog(message.author, 'additem', `**${message.author.tag}** added \`${item}\` to **${target.tag}**`, message.guild, args.join(' '), `Item: ${item}`);
    }
};

