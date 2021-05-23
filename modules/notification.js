import { MessageEmbed } from 'discord.js';
import db from '../modules/db.js';


export default async(user, author, description, color, footer) => {
    const notification = await db.utils.notifications(user.id);
    const embed = new MessageEmbed()
        .setAuthor(author)
        .setColor(`${color}`)
        .setDescription(description)
        .setFooter(footer || '');
    if (notification == true) return user.send(embed);
};
