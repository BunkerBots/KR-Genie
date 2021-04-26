const { MessageEmbed } = require('discord.js');
const data = require('../../data/JSON/help.json');
module.exports = {
    name: 'help',
    aliases: [],
    execute: async(message) => {
        message.channel.send(new MessageEmbed(data.embed));
    },
};
