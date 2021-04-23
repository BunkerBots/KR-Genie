const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const db = require('../../modules');

module.exports = {
    name: 'buy',
    aliases: ['cop', 'purchase'],
    cooldown: 25,
    execute: async(message, args) => {
        if (!args[0]) return message.reply('What are you buying lmao');
        const { wallet } = await db.utils.balance(message.author.id);
        if (wallet <= 0) return message.reply('You can\'t even get thin air for an empty wallet smh');
        if (args[0].toLowerCase() === 'premium') {
            const premium = await db.utils.premium(message.author.id);
            if (premium == true) return message.reply('You already have premium...');
            if (wallet < parseInt(data.market.items.premium)) return message.reply(`You do not have ${data.emotes.kr}${data.market.items.premium} in your wallet!`);
            await db.utils.getPremium(message.author.id);
            await db.utils.addKR(message.author.id, -parseInt(data.market.items.premium));
            message.channel.send(new MessageEmbed()
                .setTitle(`Successfully purchased ${data.emotes.premium}`)
                .setColor('GREEN')
                .setFooter('Flex on normies now'));
        // eslint-disable-next-line curly
        } else {
            message.reply('What are you doing , that item does not exist');
        }
    },
};
