const economy = require('../../scripts/economy');
const people = require('./JSON/beg.json'),
    emotes = require('../../JSON/emotes.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'beg',
    cooldown: 60,
    execute: async (message) => {
        const res = Math.floor(Math.random() * 2)
        const searchresponse = people.responses[Math.floor(Math.random() * people.responses.length)]
        const nokrresponse = people.noresponse[Math.floor(Math.random() * people.noresponse.length)]
        const KR = Math.floor(Math.random() * 500)
        const userID = message.author.id;

        if (res == 1) {
            const newBalance = await economy.addKR(userID, KR)
            message.reply(new MessageEmbed()
                .setAuthor(people.people[Math.floor(Math.random() * people.people.length)])
                .setColor('GREEN')
                .setDescription(`"${searchresponse.replace('{value}' , `${emotes.kr}${KR}`)}."`)
                .setFooter('stonks4u'))
                return;

        } else {
            message.reply(new MessageEmbed()
                .setAuthor(people.people[Math.floor(Math.random() * people.people.length)])
                .setColor('RED')
                .setDescription(`"${nokrresponse}"`)
                .setFooter('notstonks4u'))
                return;
        }

    }
}