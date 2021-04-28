const { MessageEmbed } = require('discord.js');
module.exports = async(user, author, description, color, footer) => {
    const embed = new MessageEmbed()
        .setAuthor(author)
        .setColor(`${color}`)
        .setDescription(description)
        .setFooter(footer || '');
    user.send(embed);
};
