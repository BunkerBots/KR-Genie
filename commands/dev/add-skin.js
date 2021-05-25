import { devs, staff } from '../../data/index.js';
import logger from '../../modules/logger.js';
import Skins from '../../modules/skins.js';
import db from '../../modules/db/economy.js';
import { createEmbed } from '../../modules/messageUtils.js';
const { allSkins } = Skins;


export default {
    name: 'addskin',
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
        const skin = args.join(' ').toLowerCase();
        const found = await allSkins.find(x => x.name.toLowerCase() == skin);
        if (found == undefined)
            return message.channel.send(createEmbed(message.author, 'RED', 'Unknown skin'));
        await db.utils.addSkin(target.id, found.index);
        message.channel.send(`Successfully added \`${skin}\` to \`${target.username}\``);
        logger.commandsLog(message.author, 'addskin', `**${message.author.tag}** added \`${skin}\` to **${target.tag}**`, message.guild, args.join(' '), `Skin: ${skin}`);
    }
};

