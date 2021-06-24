import db from '../../modules/db/economy.js';
import { createEmbed } from '../../modules/messageUtils.js';
import { InventoryParser, StaticEmbeds } from '../../modules/index.js';


export default {
    name: 'skins',
    aliases: ['skinsinv'],
    cooldown: 5,
    description: 'Shows the list of skins owned by an user',
    expectedArgs: 'k/skins [ID / @user]',
    execute: async(message, args) => {
        let user;
        if (!args[0] || (Number.isInteger(parseInt(args[0])) && args[0].length < 5))
            user = message.author;
        else {
            const target = await message.client.users.fetch(args.shift().replace(/\D/g, '')).catch(() => {});
            if (!target) return message.reply(createEmbed(message.author, 'RED', 'No user found!'));
            else user = target;
        }
        const data = await db.utils.skinInventory(user.id);
        const parser = new InventoryParser(data);
        const skinsarr = await parser.parseSkins();
        const embeds = new StaticEmbeds(message, skinsarr, user, args);
        embeds.generateEmbed('Skins', 'Showing skins');
    },
};

