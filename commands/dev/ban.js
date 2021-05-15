import { utils } from '../../modules/db.js';
import { devs, staff, kpd } from '../../data/index.js';
import { commandsLog } from '../../modules/logger.js';
import { createEmbed } from '../../modules/messageUtils.js';


export default {
    name: 'ban',
    cooldown: 0,
    aliases: ['ban'],
    description: 'A command made for staff/kpd to ban users from using the bot',
    expectedArgs: 'k/ban (ID / @user)',
    dev: true,
    execute: async(message, args, bot) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || kpd.includes(message.author.id)))
            return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
        if (!target)
            return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        if (devs.includes(target.id) || staff.includes(target.id) || kpd.includes(target.id))
            return message.reply(createEmbed(message.author, 'RED', 'You cannot ban devs/bot staff'));
        if (target.id == message.author.id)
            return message.reply(createEmbed(message.author, 'RED', 'You can\'t ban yourself man'));
        if (target.id == bot.user.id)
            return message.reply(createEmbed(message.author, 'RED', 'You can\'t ban the bot itself wtf'));
        if (await utils.banned(target.id) == true)
            message.reply(createEmbed(message.author, 'RED', `\`${target.username}\` is already banned`));
        await utils.ban(target.id);
        message.channel.send(createEmbed(message.author, 'GREEN', `Successfully banned \`${target.username}\``));
        commandsLog(message.author, 'ban', `**${message.author.tag}** banned **${target.tag}**`, message.guild, args.join(' '), 'Action : Ban');
    }
};
