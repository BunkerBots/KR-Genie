import { utils } from '../../modules/db.js';
import { devs, staff } from '../../data/index.js';
import { commandsLog } from '../../modules/logger.js';
import { createEmbed } from '../../modules/messageUtils.js';


export default {
    name: 'verify',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
            return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
        if (!target)
            return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        await utils.verify(target.id);
        message.channel.send(createEmbed(message.author, 'GREEN', `Successfully verified \`${target.username}\``));
        commandsLog(message.author, 'verify', `**${message.author.tag}** verified **${target.tag}**`, message.guild, args.join(' '), 'Badge: verification');
    }
};
