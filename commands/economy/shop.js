const { MessageEmbed } = require('discord.js');
const data = require('../../data');
module.exports = {
    name: 'shop',
    aliases: ['market'],
    execute: async(message) => {
        const embed = new MessageEmbed()
            .setAuthor('KR Market')
            .setDescription(`A place to blow your ${data.emotes.kr} and get cool items`)
            .addFields(
                { name: `Shop Items\n\u200b\n${data.emotes.premium} Premium : ${data.emotes.kr}${data.market.items.premium}`, value: 'Gives you a sweet badge along with numerous perks' },
                { name: `${data.emotes['face-mask']} Face mask : ${data.emotes.kr}${data.market.items['face-mask']}`, value: 'Protects user from contracting krunkitis, unboxable from spins' },
            );
        message.channel.send(embed);
    },
};
