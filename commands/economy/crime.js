const { MessageEmbed } = require('discord.js');
const data = require('../../data');
module.exports = {
    name: 'crime',
    cooldown: 1000,
    execute: async(message) => {
        const { wallet } = await data.economy.balance(message.author.id);
        const res = Math.floor(Math.random() * 100);
        if (res <= 10) {
            const deathresponse = data.crime.responses['death-response'][Math.floor(Math.random() * data.crime.responses['death-response'].length)];
            await data.economy.addKR(message.author.id, -wallet);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor('RED')
                .setDescription(`${deathresponse}`)
                .setFooter('notstonks4u'));
        } else if (res > 10 && res <= 50) {
            const favourableresponse = data.crime.responses['favourable-response'][Math.floor(Math.random() * data.crime.responses['favourable-response'].length)];
            const randomKR = parseInt(Math.floor(Math.random() * 10000));
            await data.economy.addKR(message.author.id, randomKR);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor('GREEN')
                .setDescription(`${favourableresponse.replace('[kr]', `${data.emotes.kr}${randomKR}`)}`)
                .setFooter('stonks4u'));
        } else if (res > 50 && res <= 100) {
            const favourableresponse = data.crime.responses['non-favourable-response'][Math.floor(Math.random() * data.crime.responses['non-favourable-response'].length)];
            let randomKR;
            const resp = parseInt(Math.floor(Math.random() * wallet));
            if (wallet <= 0) randomKR = 0;
            else randomKR = resp;
            await data.economy.addKR(message.author.id, -randomKR);
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setColor('RED')
                .setDescription(`${favourableresponse.replace('[kr]', `${data.emotes.kr}${randomKR}`)}`)
                .setFooter('stonks4u'));
        }
    },
};
