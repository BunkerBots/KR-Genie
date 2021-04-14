const economy = require('../../scripts/economy'),
    emotes = require('../../JSON/emotes.json');
const crime = require('./JSON/crime.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'crime',
    cooldown: 1000,
    execute: async (message, args) => {
        const res = Math.floor(Math.random() * 100);
        if (res <= 10) {
            const deathresponse = crime.responses['death-response'][Math.floor(Math.random() * crime.responses['death-response'].length)]
            const availableBalance = await economy.balance(message.author.id);
            await economy.addKR(message.author.id, -availableBalance)
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor('RED')
                .setDescription(`${deathresponse}`)
                .setFooter('notstonks4u'))
        } else if (res > 10 && res <= 50) {
            const favourableresponse = crime.responses['favourable-response'][Math.floor(Math.random() * crime.responses['favourable-response'].length)]
            const randomKR = Math.floor(Math.random() * 10000)
            await economy.addKR(message.author.id, randomKR);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor('GREEN')
                .setDescription(`${favourableresponse.replace('[kr]' , `${emotes.kr}${randomKR}`)}`)
                .setFooter('stonks4u'))
        } else if (res > 50 && res <= 100) {
            const favourableresponse = crime.responses['non-favourable-response'][Math.floor(Math.random() * crime.responses['non-favourable-response'].length)]
            const randomKR = Math.floor(Math.random() * 10000)
            await economy.addKR(message.author.id, -randomKR);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor('RED')
                .setDescription(`${favourableresponse.replace('[kr]' , `${emotes.kr}${randomKR}`)}`)
                .setFooter('stonks4u'))
        }
    }
}