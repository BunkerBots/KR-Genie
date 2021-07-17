import db from '../../modules/db/economy.js';
import { MessageEmbed } from 'discord.js';
import { createEmbed } from '../../modules/messageUtils.js';


export default {
    name: 'notifications',
    aliases: ['notifs', 'notification'],
    cooldown: 10,
    description: 'Choose whether the bot should DM you the notifications or no',
    expectedArgs: 'k/notifications [on / off]',
    execute: async(message, args) => {
        const notifs = await db.utils.notifications(message.author.id);
        const pos = ['on', 'ye', 'yes'];
        const neg = ['off', 'nay', 'no'];
        let desc;
        if (!args[0]) {
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('DM Notifications')
                .setDescription('When enabled the bot will DM you the notifications.\n**To enable** type `k/notifications on`\n**To disable** type `k/notifications off`'));
            return;
        }

        if (!pos.concat(neg).includes(args[0].toLowerCase())) return message.reply(createEmbed(message.author, 'RED', 'That\'s not a valid option,my god you\'re dumb'));
        if (pos.includes(args[0].toLowerCase())) {
            if (notifs == true) return message.reply(createEmbed(message.author, 'RED', '`DM notifications` are already enabled'));
            await db.utils.enableNotifications(message.author.id);
            desc = 'Successfully `enabled` DM notifications';
        } else if (neg.includes(args[0].toLowerCase())) {
            if (notifs == false) return message.reply(createEmbed(message.author, 'RED', '`DM notifications` are already disabled'));
            await db.utils.disableNotifications(message.author.id);
            desc = 'Successfully `disabled` DM notifications';
        }
        message.reply(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('DM Notifications')
            .setColor('GREEN')
            .setDescription(desc));
    },
};

