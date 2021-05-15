import { utils } from '../../modules';
import { devs, emotes } from '../../data';


export default {
    name: 'devcure',
    dev: true,
    execute: async(message, args) => {
        if (!devs.includes(message.author.id))
            return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
        if (!target)
            return message.channel.send('Unknown user');
        await utils.cure(target.id);
        message.channel.send(`Successfully cured \`${target.username}\` ${emotes.krunkitis}`);
    }
};

