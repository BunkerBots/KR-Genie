const economy = require('../../scripts/economy');
const response = require('./JSON/search.json'),
emotes = require('../../JSON/emotes.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'work',
    cooldown: 720,
    execute: async (message) => {
        const searchresponse = response.responses[Math.floor(Math.random() * response.responses.length)]
        const KR = Math.floor(Math.random() * 500)
        const userID = message.author.id;
        const newBalance = await economy.addKR(userID , KR)
        message.reply(new MessageEmbed()
        .setAuthor(message.author.username , message.author.displayAvatarURL({dynamic: false}))
        .setColor('GREEN')
        .setDescription(`${searchresponse} ${emotes.kr}${KR}.`))
    }
}