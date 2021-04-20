const data = require('../../data');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'work',
    cooldown: 720,
    execute: async(message) => {
        const workresponse = data.work.responses[Math.floor(Math.random() * data.work.responses.length)];
        const KR = parseInt(Math.floor(Math.random() * 1000));
        const userID = message.author.id;
        await data.economy.addKR(userID, KR);
        message.reply(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
            .setColor('GREEN')
            .setDescription(`${workresponse.replace('[kr]', `${data.emotes.kr}${KR}`)}.`));
    },
};
