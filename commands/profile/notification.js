import db from '../../modules/db/economy.js';
import { MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { disableComponents } from '../../modules/messageUtils.js';
import { timeout } from '../../data/index.js';


export default {
    name: 'notifications',
    aliases: ['notifs', 'notification'],
    cooldown: 10,
    description: 'Choose whether the bot should DM you the notifications or no',
    expectedArgs: 'k/notifications [on / off]',
    execute: async(message) => {
        const notifs = await db.utils.notifications(message.author.id);
        const enablebtn = new MessageButton()
            .setLabel('Enable')
            .setCustomId('enable')
            .setStyle('SUCCESS');

        const disablebtn = new MessageButton()
            .setLabel('Disable')
            .setCustomId('disable')
            .setStyle('DANGER');

        if (!notifs) disablebtn.setDisabled(true);
        else if (notifs) enablebtn.setDisabled(true);


        const row = new MessageActionRow()
            .addComponents(enablebtn, disablebtn);

        const msg = await message.reply({ embeds: [new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('DM Notifications')
            .setDescription('When enabled the bot will DM you the notifications.')], components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: timeout.notification });
        collector.on('collect', async i => {
            // if (i.user.id !== message.author.id) return i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
            console.log(i.user.id, message.author.id);
            if (i.customId === 'enable') {
                await db.utils.enableNotifications(message.author.id);
                i.reply({ content: 'Successfully enabled notifications', ephemeral: true });
            } else if (i.customId == 'disable') {
                await db.utils.disableNotifications(message.author.id);
                i.reply({ content: 'Successfully disabled notifications', ephemeral: true });
            }
            disableComponents(msg);
            collector.stop();
        });

        collector.on('end', (i) => { if (i.size == 0) disableComponents(msg); });
    },
};

