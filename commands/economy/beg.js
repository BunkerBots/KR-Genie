const { MessageEmbed } = require('discord.js');
const dependencies = require('../../data/dependencies')
module.exports = {
    name: 'beg',
    cooldown: 60,
    execute: async (message) => {
        const res = Math.floor(Math.random() * 2)
        const searchresponse = dependencies.beg.responses[Math.floor(Math.random() * dependencies.beg.responses.length)]
        const nokrresponse = dependencies.beg.noresponse[Math.floor(Math.random() * dependencies.beg.noresponse.length)]
        const KR = Math.floor(Math.random() * 500)
        const userID = message.author.id;

        if (res == 1) {
            await dependencies.economy.addKR(userID, KR)
            message.reply(new MessageEmbed()
                .setAuthor(dependencies.beg.people[Math.floor(Math.random() * dependencies.beg.people.length)])
                .setColor('GREEN')
                .setDescription(`"${searchresponse.replace('{value}' , `${dependencies.emotes.kr}${KR}`)}."`)
                .setFooter('stonks4u'))
                return;

        } else {
            message.reply(new MessageEmbed()
                .setAuthor(dependencies.beg.people[Math.floor(Math.random() * dependencies.beg.people.length)])
                .setColor('RED')
                .setDescription(`"${nokrresponse}"`)
                .setFooter('notstonks4u'))
                return;
        }

    }
}