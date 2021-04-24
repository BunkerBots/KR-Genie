const { MessageEmbed } = require('discord.js');
const data = require('../../data');

module.exports = {
    name: 'item',
    aliases: ['info'],
    cooldown: 25,
    execute: async(message, args) => {
        if (!args[0]) return message.reply('You need to provide an item name , its common sense really');
        if (args[0].toLowerCase() === 'premium') {
            message.channel.send(new MessageEmbed()
                .setTitle(`${data.emotes.premium} Premium`)
                .setColor('GREEN')
                .setDescription(`${data.emotes.kr}${data.market.items.premium}\nA shiny golden badge that comes with perks like , increased spins limit, access to premium commands, multi on certain commands etc`)
                .setFooter('Flex on the normies'));
        // eslint-disable-next-line curly
        } else if (args[0].toLowerCase() === 'face' || (args[0].toLowerCase() === 'face' && args[1].toLowerCase() === 'mask')) {
            message.channel.send(new MessageEmbed()
                .setTitle(`${data.emotes['face-mask']} Face mask`)
                .setColor('GREEN')
                .setDescription(`${data.emotes.kr}${data.market.items['face-mask']}\nAn accessory that protects you from contracting krunkitis, can be obtained from spins as well.`)
                .setFooter('dab on krunkitis'));
        } else if (args[0].toLowerCase() === 'cure' || args[0].toLowerCase() === 'antidote') {
            message.channel.send(new MessageEmbed()
                .setTitle(`${data.emotes.antidote} Antidote xvi`)
                .setColor('GREEN')
                .setDescription(`${data.emotes.kr}${data.market.items.antidote}\nAn item that cures infected users, can be obtained from spins`)
                .setFooter('rip krunkitis'));
        } else
            message.reply('What are you doing , that item does not exist');
    },
};
