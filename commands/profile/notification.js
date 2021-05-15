import db from '../../modules';
import { MessageEmbed } from 'discord.js';
import { createEmbed } from '../../modules/messageUtils';


module.exports = {
    name: 'notifications',
    aliases: ['notifs', 'notification'],
    cooldown: 10,
    description: 'Choose whether the bot should DM you the notifications or no',
    expectedArgs: 'k/notifications [on / off]',
    execute: async(message, args) => {
        const notifs = await db.utils.notifications(message.author.id);
        if (!args[0]) {
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('DM Notifications')
                .setDescription('When enabled the bot will DM you the notifications.\n**To enable** type `k/notifications on`\n**To disable** type `k/notifications off`'));
            return;
        }
        if (args[0].toLowerCase() === 'on') {
            if (notifs == true) return message.reply(createEmbed(message.author, 'RED', '`DM notifications` are already enabled'));
            await db.utils.enableNotifications(message.author.id);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('DM Notifications')
                .setColor('GREEN')
                .setDescription('Successfully `enabled` DM notifications'));
        } else if (args[0].toLowerCase() === 'off') {
            if (notifs == false) return message.reply(createEmbed(message.author, 'RED', '`DM notifications` are already disabled'));
            await db.utils.disableNotifications(message.author.id);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('DM Notifications')
                .setColor('GREEN')
                .setDescription('Successfully `disabled` DM notifications'));
        } else message.reply(createEmbed(message.author, 'RED', 'That\'s not a valid option,my god you\'re dumb'));
    },
};
