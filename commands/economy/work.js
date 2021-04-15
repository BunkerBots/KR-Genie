const dependencies = require('../../data/dependencies')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'work',
    cooldown: 720,
    execute: async (message) => {
        const workresponse = dependencies.work.responses[Math.floor(Math.random() * dependencies.work.responses.length)]
        const KR = Math.floor(Math.random() * 500)
        const userID = message.author.id;
        await dependencies.economy.addKR(userID , KR)
        message.reply(new MessageEmbed()
        .setAuthor(message.author.username , message.author.displayAvatarURL({dynamic: false}))
        .setColor('GREEN')
        .setDescription(`${workresponse.replace('[kr]' , `${dependencies.emotes.kr}${KR}`)}.`))
    }
}