import { utils } from '../../modules';
import { devs, staff } from '../../data';
import { commandsLog } from '../../modules/logger';
import { createEmbed } from '../../modules/messageUtils';


export const name = 'removepremium';
export const aliases = ['delprem'];
export const dev = true;
export async function execute(message, args) {
    if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
        return;
    const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
    if (!target)
        return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
    await utils.removePremium(target.id);
    message.channel.send(createEmbed(message.author, 'GREEN', `Successfully removed premium from \`${target.username}\``));
    commandsLog(message.author, 'removepremium', `**${message.author.tag}** removed premium **${target.tag}**`, message.guild, args.join(' '), 'Badge: premium');
}
