// import { createCanvas, loadImage } from 'canvas';
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';
import skinsCmd from '../skins-market/listings.js';
import collectablesCmd from '../../modules/shop/collectables.js';
import toolsCmd from '../../modules/shop/shop.js';
import { core, timeout, images } from '../../data/index.js';
import { disableComponents } from '../../modules/messageUtils.js';

const menuOptions = [{
    label: 'Tools shop',
    description: 'Items that has some kind of use',
    value: 'tools',
},
{
    label: 'Skins market',
    description: 'Real time skins listing',
    value: 'skins',
},
{
    label: 'Collectables shop',
    description: 'They do not have any specific use',
    value: 'collectables',
}];

export default {
    name: 'shop',
    aliases: ['market'],
    cooldown: 5,
    description: 'A place where you can purchase various useful items',
    expectedArgs: 'k/shop',
    execute: async(message, args) => {
        const menuEmbed = new MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.avatarURL({ dynamic: true }))
            .setDescription('Please select a market type from the menu given below')
            .addField('Tools shop', '```⬩ Items that can be used for specific purposes```', true)
            .addField('Skins market', '```⬩ Real time skin listings```', true)
            .setImage(images['skins-market'].toString())
            .addField('Collectables shop', '```⬩ Collectables which does not serve any specific purpose other than flexing```', true)
            .setColor(core.embed)
            .setTimestamp();


        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('shop')
                    .setMaxValues(1)
                    .setPlaceholder('Select a market type')
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

