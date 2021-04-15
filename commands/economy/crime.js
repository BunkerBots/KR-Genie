const { MessageEmbed } = require('discord.js');
const dependencies = require('../../data/dependencies')
module.exports = {
    name: 'crime',
    cooldown: 1000,
    execute: async (message, args) => {
        const res = Math.floor(Math.random() * 100);
        if (res <= 10) {
            const deathresponse = dependencies.crime.responses['death-response'][Math.floor(Math.random() * dependencies.crime.responses['death-response'].length)]
            const availableBalance = await dependencies.economy.balance(message.author.id);
            await dependencies.economy.addKR(message.author.id, -availableBalance)
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor('RED')
                .setDescription(`${deathresponse}`)
                .setFooter('notstonks4u'))
        } else if (res > 10 && res <= 50) {
            const favourableresponse = dependencies.crime.responses['favourable-response'][Math.floor(Math.random() * dependencies.crime.responses['favourable-response'].length)]
            const randomKR = Math.floor(Math.random() * 10000)
            await dependencies.economy.addKR(message.author.id, randomKR);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor('GREEN')
                .setDescription(`${favourableresponse.replace('[kr]' , `${dependencies.emotes.kr}${randomKR}`)}`)
                .setFooter('stonks4u'))
        } else if (res > 50 && res <= 100) {
            const favourableresponse = dependencies.crime.responses['non-favourable-response'][Math.floor(Math.random() * dependencies.crime.responses['non-favourable-response'].length)]
            const randomKR = Math.floor(Math.random() * 10000)
            await dependencies.economy.addKR(message.author.id, -randomKR);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor('RED')
                .setDescription(`${favourableresponse.replace('[kr]' , `${dependencies.emotes.kr}${randomKR}`)}`)
                .setFooter('stonks4u'))
        }
    }
}