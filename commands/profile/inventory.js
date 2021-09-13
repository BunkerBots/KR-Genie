// import { createCanvas, loadImage } from 'canvas';
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';
import skinsCmd from '../../modules/inventory/skins.js';
import collectablesCmd from '../../modules/inventory/collectables.js';
import toolsCmd from '../../modules/inventory/tools.js';
import { core, timeout } from '../../data/index.js';
import { disableComponents } from '../../modules/messageUtils.js';

const menuOptions = [{
    label: 'Tools',
    description: 'Tools inventory',
    value: 'tools',
},
{
    label: 'Skins',
    description: 'Skins inventory',
    value: 'skins',
},
{
    label: 'Collectables',
    description: 'Collectables inventory',
    value: 'collectables',
}];

export default {
    name: 'inventory',
    aliases: ['inv'],
    cooldown: 5,
    description: 'Displays the items owned by an user',
    expectedArgs: 'k/inventory [ID / @user]',
    execute: async(message, args) => {
        const menuEmbed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.avatarURL({ dynamic: true }))
            .setDescription('Please select an Inventory type from the menu given below')
            .addField('Tools', '```⬩ Items that have unique abilities\n\u200b```', true)
            .addField('Skins', '```⬩ The place where all your skins are stored safely```', true)
            .addField('Collectables', '```⬩ Contains all of your collectables\n\u200b```', true)
            .setColor(core.embed)
            .setTimestamp();


        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('inventory')
                    .setMaxValues(1)
                    .setPlaceholder('Select an inventory type')
                    .addOptions(menuOptions),
            );

        const menu = await message.reply({ components: [row], embeds: [menuEmbed], failIfNotExists: false });

        const collector = menu?.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: timeout.inventory });

        collector.on('collect', async i => {
            if (await global.handleInteraction(i, message)) return;
            // if (i.user.id !== message.author.id) return i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
            if (i.values[0] == 'skins') skinsCmd.execute(message, args);
            else if (i.values[0] == 'tools') toolsCmd.execute(message, args);
            else if (i.values[0] == 'collectables') collectablesCmd.execute(message, args);
            menu.delete();
        });

        collector.on('end', (i) => { if (i.size == 0) disableComponents(menu); });
    }
};

