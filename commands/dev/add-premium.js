import { devs, staff } from '../../data/index.js';
import logger from '../../modules/logger.js';
import { createEmbed } from '../../modules/messageUtils.js';
import db from '../../modules/db.js';


export default {
    name: 'addpremium',
    aliases: ['addprem'],
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
            return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
        if (!target)
            return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        await db.utils.getPremium(target.id);
        message.channel.send(createEmbed(message.author, 'GREEN', `Successfully added premium for \`${target.username}\``));
        logger.commandsLog(message.author, 'addpremium', `**${message.author.tag}** added premium **${target.tag}**`, message.guild, args.join(' '), 'Badge: premium');
    }
};

