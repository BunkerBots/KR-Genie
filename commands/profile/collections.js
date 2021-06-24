import db from '../../modules/db/economy.js';
import { createEmbed } from '../../modules/messageUtils.js';
import { InventoryParser, StaticEmbeds } from '../../modules/index.js';


export default {
    name: 'collection',
    aliases: ['collections'],
    cooldown: 5,
    description: 'Shows the list of collectables owned by an user',
    expectedArgs: 'k/collection [ID / @user]',
    execute: async(message, args) => {
        let user;
        if (!args[0] || (Number.isInteger(parseInt(args[0])) && args[0].length < 5))
            user = message.author;
        else {
            const target = await message.client.users.fetch(args.shift().replace(/\D/g, '')).catch(() => {});
            if (!target) return message.reply(createEmbed(message.author, 'RED', 'No user found!'));
            else user = target;
        }
        const data = await db.utils.collectablesInventory(user.id);
        const parser = new InventoryParser(data);
        const collectablesarr = await parser.parseCollectables();
        const embeds = new StaticEmbeds(message, collectablesarr, user, args);
        embeds.generateEmbed('Collectables', 'Showing collectables');
    },
};

