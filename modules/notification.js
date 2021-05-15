import { MessageEmbed } from 'discord.js';
import { utils } from '../modules';


export default async(user, author, description, color, footer) => {
    const notification = await utils.notifications(user.id);
    const embed = new MessageEmbed()
        .setAuthor(author)
        .setColor(`${color}`)
        .setDescription(description)
        .setFooter(footer || '');
    if (notification == true) return user.send(embed);
};
