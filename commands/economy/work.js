const economy = require('../../scripts/economy');
const work = require('./JSON/work.json'),
emotes = require('../../JSON/emotes.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'work',
    cooldown: 720,
    execute: async (message) => {
        const workresponse = work.responses[Math.floor(Math.random() * work.responses.length)]
        const KR = Math.floor(Math.random() * 500)
        const userID = message.author.id;
        const newBalance = await economy.addKR(userID , KR)
        message.reply(new MessageEmbed()
        .setAuthor(message.author.username , message.author.displayAvatarURL({dynamic: false}))
        .setColor('GREEN')
        .setDescription(`${workresponse.replace('[kr]' , `${emotes.kr}${KR}`)}.`))
    }
}