const { MessageEmbed } = require('discord.js'),
    data = require('../../data'),
    db = require('../../modules');

module.exports = {
    name: 'beg',
    cooldown: 60,
    execute: async(message) => {
        const res = Math.floor(Math.random() * 2);
        const response = {
            positive: data.beg.responses[Math.floor(Math.random() * data.beg.responses.length)],
            negative: data.beg.noresponse[Math.floor(Math.random() * data.beg.noresponse.length)],
        };
        const KR = parseInt(Math.floor(Math.random() * 500));

        const userID = message.author.id;

        let color, description, footer;
        if (res == 1) {
            color = 'GREEN',
            footer = 'stonks4u',
            description = response.positive;
            await db.utils.addKR(userID, KR);
        } else {
            color = 'RED',
            footer = 'notstonks4u',
            description = response.negative;
        }
        message.reply(new MessageEmbed()
            .setAuthor(data.beg.people[Math.floor(Math.random() * data.beg.people.length)])
            .setColor(color)
            .setDescription(description)
            .setFooter(footer));
    },
};
