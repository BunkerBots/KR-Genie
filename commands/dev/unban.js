import { utils } from '../../modules';
import { devs, staff, kpd } from '../../data';
import { commandsLog } from '../../modules/logger';
import { createEmbed } from '../../modules/messageUtils';

export const name = 'unban';
export const dev = true;
export async function execute(message, args) {
    if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || kpd.includes(message.author.id)))
        return;
    const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
    if (!target)
        return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
    if (devs.includes(target.id) || staff.includes(target.id))
        return message.reply('You cannot use this command on devs/bot staff');
    if (await utils.banned(target.id) == false)
        return message.reply(createEmbed(message.author, 'RED', `\`${target.username}\` is not banned`));
    await utils.unban(target.id);
    message.channel.send(createEmbed(message.author, 'GREEN', `Successfully unbanned \`${target.username}\``));
    commandsLog(message.author, 'unban', `**${message.author.tag}** unbanned **${target.tag}**`, message.guild, args.join(' '), 'Action : unban');
}
