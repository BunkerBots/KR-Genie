import db from '../../modules/db/economy.js';
import { devs, staff } from '../../data/index.js';
import logger from '../../modules/logger.js';
import { createEmbed } from '../../modules/messageUtils.js';


export default {
    name: 'unverify',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
            return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
        if (!target)
            return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        await db.utils.unverify(target.id);
        message.channel.send(createEmbed(message.author, 'GREEN', `Successfully unverified \`${target.username}\``));
        logger.commandsLog(message.author, 'unverify', `**${message.author.tag}** unverified **${target.tag}**`, message.guild, args.join(' '), 'Badge: revoked verification');
    }
};
