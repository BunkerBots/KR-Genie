import { devs, staff } from '../../data';
import { commandsLog } from '../../modules/logger';
import { allSkins } from '../../modules/skins';
import { utils } from '../../modules';
import { createEmbed } from '../../modules/messageUtils';


export const name = 'addskin';
export const dev = true;
export async function execute(message, args) {
    if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
        return;
    if (!args[0])
        return;
    const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
    if (!target)
        return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
    args.shift();
    const skin = args.join(' ').toLowerCase();
    const found = await allSkins.find(x => x.name.toLowerCase() == skin);
    if (found == undefined)
        return message.channel.send(createEmbed(message.author, 'RED', 'Unknown skin'));
    await utils.addSkin(target.id, found.index);
    message.channel.send(`Successfully added \`${skin}\` to \`${target.username}\``);
    commandsLog(message.author, 'addskin', `**${message.author.tag}** added \`${skin}\` to **${target.tag}**`, message.guild, args.join(' '), `Skin: ${skin}`);
}
