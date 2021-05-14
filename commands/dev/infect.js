import { utils } from '../../modules';
import { devs, staff, emotes } from '../../data';


export const name = 'devinfect';
export const dev = true;
export async function execute(message, args) {
    if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
        return;
    const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
    if (!target)
        return message.channel.send('Unknown user');
    await utils.infect(target.id);
    message.channel.send(`Successfully infected \`${target.username}\` ${emotes.krunkitis}`);
}
