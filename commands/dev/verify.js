import { utils } from '../../modules';
import { devs, staff } from '../../data';
import { commandsLog } from '../../modules/logger';
import { createEmbed } from '../../modules/messageUtils';


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
