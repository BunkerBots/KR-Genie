const { MessageEmbed } = require('discord.js'),
    db = require('../modules');
module.exports = async(user, author, description, color, footer) => {
    const notification = await db.utils.notifications(user.id);
    const embed = new MessageEmbed()
        .setAuthor(author)
        .setColor(`${color}`)
        .setDescription(description)
        .setFooter(footer || '');
    if (notification == true) return user.send(embed);
};
