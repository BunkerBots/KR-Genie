const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const db = require('../../modules'),
    comma = require('../../modules/comma'),
    utils = require('../../modules/messageUtils'),
    levels = require('../../mongo');

module.exports = {
    name: 'crime',
    aliases: ['crime'],
    cooldown: 900,
    description: `A command to bag good amount of ${data.emotes.kr}. Beware with great rewards comes great risks. There is a 10% chance that you will die and lose all your coins, 40% chance of failure and 50% chance of success`,
    expectedArgs: 'k/crime',
    execute: async(message) => {
        const { wallet, bank } = await db.utils.balance(message.author.id);
        const netWorth = parseInt(wallet + bank);
        if (netWorth < 0) return message.reply(utils.createEmbed(message.author, 'RED', 'Bro you\'re already broke...I can\'t let you do this'));
        const tenth = parseInt(Math.ceil(netWorth / 10));
        const res = Math.floor(Math.random() * 100);
        let description, footer, kr, color;
        if (res <= 10) {
            description = data.crime.responses['death-response'][Math.floor(Math.random() * data.crime.responses['death-response'].length)];
            footer = 'notstonks4u';
            color = 'RED';
            kr = -parseInt(wallet);
        } else if (res > 50 && res <= 100) {
            const favourableresponse = data.crime.responses['favourable-response'][Math.floor(Math.random() * data.crime.responses['favourable-response'].length)];
            const randomKR = parseInt(Math.floor(Math.random() * 5000) + 5000);
            description = `${favourableresponse.replace('[kr]', `${data.emotes.kr}${comma(randomKR)}`)}`;
            footer = 'stonks4u';
            color = 'GREEN';
            kr = randomKR;
        } else if (res > 10 && res <= 50) {
            const favourableresponse = data.crime.responses['non-favourable-response'][Math.floor(Math.random() * data.crime.responses['non-favourable-response'].length)];
            let randomKR;
            let fine;
            if (netWorth >= 10000) fine = Math.ceil(500);
            else if (netWorth < 10000) fine = tenth;
            const resp = parseInt(Math.floor(Math.random() * fine) + 500);
            // eslint-disable-next-line prefer-const
            randomKR = resp;
            kr = -randomKR;
            color = 'RED';
            description = `${favourableresponse.replace('[kr]', `${data.emotes.kr}${comma(randomKR)}`)}`;
            footer = 'notstonks4u';
        }
        if (kr) await db.utils.addKR(message.author.id, kr);
        message.reply(
            new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor(color)
                .setDescription(description)
                .setFooter(footer),
        );
        levels.addXP(message.author.id, 23, message);
    },
};
