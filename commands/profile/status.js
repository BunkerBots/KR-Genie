import db from '../../modules/db/economy.js';
import { InventoryParser } from '../../modules/index.js';
import { allSkins as totalSkins } from 'krunker-skin-pack';
import { createEmbed } from '../../modules/messageUtils.js';
import core from '../../data/JSON/core.json';


export default {
    name: 'status',
    aliases: ['stats', 'stat'],
    cooldown: 3,
    description: 'Displays the economy statistics of an user. Spin count, number of skins owned etc',
    expectedArgs: 'k/status [ID / @user]',
    execute: async(message, args) => {
        let user;
        if (!args[0] || (Number.isInteger(parseInt(args[0])) && args[0].length < 5))
            user = message.author;
        else {
            const target = await message.client.users.fetch(args.shift().replace(/\D/g, '')).catch(() => {});
            if (!target) return message.reply(createEmbed(message.author, 'RED', 'No user found!'));
            else user = target;
        }
        const inventory = await db.utils.skinInventory(user.id);
        const spinCount = await db.utils.spinCount(user.id);
        const parser = new InventoryParser(inventory);
        const embed = parser.spinStatus();
        embed.setColor(core.embed);
        embed.setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }));
        embed.setTitle(`${user.username}'s Status`);
        embed.setDescription(`Total Spins : \`${spinCount}\`\nSkins collected : \`${inventory.length}/${totalSkins.length}\``);
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    },
};
