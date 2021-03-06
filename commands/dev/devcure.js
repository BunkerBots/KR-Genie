import db from '../../modules/db/economy.js';
import { devs, emotes } from '../../data/index.js';


export default {
    name: 'devcure',
    dev: true,
    execute: async(message, args) => {
        if (!devs.includes(message.author.id))
            return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
        if (!target)
            return message.channel.send('Unknown user');
        await db.utils.cure(target.id);
        message.channel.send(`Successfully cured \`${target.username}\` ${emotes.krunkitis}`);
    }
};

