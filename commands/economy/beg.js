const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const db = require('../../modules');

module.exports = {
    name: 'beg',
    cooldown: 60,
    execute: async(message) => {
        const res = Math.floor(Math.random() * 2);
        const searchresponse = data.beg.responses[Math.floor(Math.random() * data.beg.responses.length)];
        const nokrresponse = data.beg.noresponse[Math.floor(Math.random() * data.beg.noresponse.length)];
        const KR = parseInt(Math.floor(Math.random() * 500));
        const userID = message.author.id;

        if (res == 1) {
            await db.utils.addKR(userID, KR);
            message.reply(new MessageEmbed()
                .setAuthor(data.beg.people[Math.floor(Math.random() * data.beg.people.length)])
                .setColor('GREEN')
                .setDescription(`${searchresponse.replace('{value}', `${data.emotes.kr}${KR}`)}.`)
                .setFooter('stonks4u'));
        } else {
            message.reply(new MessageEmbed()
                .setAuthor(data.beg.people[Math.floor(Math.random() * data.beg.people.length)])
                .setColor('RED')
                .setDescription(`${nokrresponse}`)
                .setFooter('notstonks4u'));
        }
    },
};
