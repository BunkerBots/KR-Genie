import db from '../../modules/db/economy.js';
import { devs, staff, kpd } from '../../data/index.js';
import logger from '../../modules/logger.js';
import { createEmbed } from '../../modules/messageUtils.js';

export default {
    name: 'unban',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || kpd.includes(message.author.id)))
            return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
        if (!target)
            return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        if (devs.includes(target.id) || staff.includes(target.id))
            return message.reply('You cannot use this command on devs/bot staff');
        if (await db.utils.banned(target.id) == false)
            return message.reply(createEmbed(message.author, 'RED', `\`${target.username}\` is not banned`));
        await db.utils.unban(target.id);
        message.channel.send(createEmbed(message.author, 'GREEN', `Successfully unbanned \`${target.username}\``));
        logger.commandsLog(message.author, 'unban', `**${message.author.tag}** unbanned **${target.tag}**`, message.guild, args.join(' '), 'Action : unban');
    }
};
