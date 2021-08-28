// import { createCanvas, loadImage } from 'canvas';
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';
import skinsCmd from '../../modules/inventory/skins.js';
import collectablesCmd from '../../modules/inventory/collectables.js';
import toolsCmd from '../../modules/inventory/tools.js';
import { core } from '../../data/index.js';
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
            .setDescription('Please select an appropriate category from the menu given below')
            .setColor(core.embed)
            .setTimestamp();


        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('inventory')
                    .setMaxValues(1)
                    .setPlaceholder('Select a category')
                    .addOptions(menuOptions),
            );

        const menu = await message.reply({ components: [row], embeds: [menuEmbed] });

        const filter = i => i.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 60000 });

        collector.on('collect', async i => {
            // if (i.user.id !== message.author.id) return i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
            if (i.values[0] == 'skins') skinsCmd.execute(message, args);
            else if (i.values[0] == 'tools') toolsCmd.execute(message, args);
            else if (i.values[0] == 'collectables') collectablesCmd.execute(message, args);
            menu.delete();
        });

        collector.on('end', () => console.log('timer end'));
    }
};

