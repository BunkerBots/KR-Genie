const { MessageEmbed } = require('discord.js'),
    market = require('../../data').market,
    db = require('../../modules'),
    emotes = require('../../data').emotes;

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
            if (wallet < parseInt(market.items.premium.price)) return message.reply(`You do not have ${emotes.kr}${market.items.premium.displayprice} in your wallet!`);
            await db.utils.getPremium(message.author.id);
            await db.utils.addKR(message.author.id, -parseInt(market.items.premium.price));
            message.channel.send(new MessageEmbed()
                .setTitle(`Successfully purchased ${emotes.premium}`)
                .setColor('GREEN')
                .setFooter('Flex on normies now'));
        // eslint-disable-next-line curly
        } else if (args[0].toLowerCase() === 'face' || (args[0].toLowerCase() === 'face' && args[1].toLowerCase() === 'mask')) {
            if (wallet < parseInt(market.items['face-mask'].price)) return message.reply(`You do not have ${emotes.kr}${market.items['face-mask'].displayprice} in your wallet!`);
            await db.utils.addSkin(message.author.id, parseInt(944));
            await db.utils.addKR(message.author.id, -parseInt(market.items['face-mask'].price));
            message.channel.send(new MessageEmbed()
                .setTitle(`Successfully purchased ${emotes['face-mask']}`)
                .setColor('GREEN')
                .setFooter('dab on krunkitis'));
        } else if (args[0].toLowerCase() === 'cure' || args[0].toLowerCase() === 'antidote') {
            if (wallet < parseInt(market.items.antidote.price)) return message.reply(`You do not have ${emotes.kr}${market.items.antidote.displayprice} in your wallet!`);
            await db.utils.addSkin(message.author.id, parseInt(1659));
            await db.utils.addKR(message.author.id, -parseInt(market.items.antidote.price));
            message.channel.send(new MessageEmbed()
                .setTitle(`Successfully purchased ${emotes.antidote}`)
                .setColor('GREEN')
                .setFooter('krunkitis going extinct now'));
        } else if (args[0].toLowerCase() === 'asokra' || (args[0].toLowerCase() === 'asokra\'s' && args[1].toLowerCase() === 'trophy' && args[2].toLowerCase() === 'case')) {
            if (wallet < parseInt(market.items.asokra.price)) return message.reply(`You do not have ${emotes.kr}${market.items.asokra.displayprice} in your wallet!`);
            await db.utils.addItem(message.author.id, parseInt(1));
            await db.utils.addKR(message.author.id, -parseInt(market.items.asokra.displayprice));
            message.channel.send(new MessageEmbed()
                .setTitle(`Successfully purchased ${market.items.asokra.icon}`)
                .setColor('GREEN')
                .setFooter('Professional comp player now'));
        } else
            message.reply('What are you doing , that item does not exist');
    },
};
