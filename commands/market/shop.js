const { MessageEmbed } = require('discord.js'),
    market = require('../../data').market,
    emotes = require('../../data').emotes;
module.exports = {
    name: 'shop',
    aliases: ['market'],
    execute: async(message) => {
        const embed = new MessageEmbed()
            .setAuthor('KR Market')
            .setDescription(`A place to blow your ${emotes.kr} and get cool items`)
            .addFields(
                { name: `Shop Items\n\u200b\n${market.items.premium.icon} ${market.items.premium.name} : ${emotes.kr}${market.items.premium.displayprice}`, value: `${market.items.premium.description}` },
                { name: `${market.items['face-mask'].icon} ${market.items['face-mask'].name} : ${emotes.kr}${market.items['face-mask'].displayprice}`, value: `${market.items['face-mask'].description}` },
                { name: `${market.items.antidote.icon} ${market.items.antidote.name} : ${emotes.kr}${market.items.antidote.displayprice}`, value: `${market.items.antidote.description}` },
                { name: `${market.items.asokra.icon} ${market.items.asokra.name} : ${emotes.kr}${market.items.asokra.displayprice}`, value: `${market.items.asokra.description}` },
                { name: `${market.items.earish.icon} ${market.items.earish.name} : ${emotes.kr}${market.items.earish.displayprice}`, value: `${market.items.earish.description}` },
                { name: `${market.items.slick.icon} ${market.items.slick.name} : ${emotes.kr}${market.items.slick.displayprice}`, value: `${market.items.slick.description}` },
                { name: `${market.items.jytesh.icon} ${market.items.jytesh.name} : ${emotes.kr}${market.items.jytesh.displayprice}`, value: `${market.items.jytesh.description}` },
                { name: `${market.items.disney.icon} ${market.items.disney.name} : ${emotes.kr}${market.items.disney.displayprice}`, value: `${market.items.disney.description}` },
                { name: `${market.items.jon.icon} ${market.items.jon.name} : ${emotes.kr}${market.items.jon.displayprice}`, value: `${market.items.jon.description}` },
            );
        message.channel.send(embed);
    },
};
