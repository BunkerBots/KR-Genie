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
                .setAuthor(`Successfully purchased ${market.items.premium.name}`)
                .setColor('GREEN')
                .setDescription(`<@${message.author.id}> bought ${emotes.premium}${market.items.premium.name} and paid ${emotes.kr}${market.items.premium.displayprice}`)
                .setFooter('Flex on normies now'));
        // eslint-disable-next-line curly
        } else if (args[0].toLowerCase() === 'face' || (args[0].toLowerCase() === 'face' && args[1].toLowerCase() === 'mask')) {
            if (wallet < parseInt(market.items['face-mask'].price)) return message.reply(`You do not have ${emotes.kr}${market.items['face-mask'].displayprice} in your wallet!`);
            await db.utils.addSkin(message.author.id, parseInt(944));
            await db.utils.addKR(message.author.id, -parseInt(market.items['face-mask'].price));
            message.channel.send(new MessageEmbed()
                .setAuthor(`Successfully purchased ${market.items['face-mask'].name}`)
                .setColor('GREEN')
                .setDescription(`<@${message.author.id}> bought ${emotes['face-mask']}${market.items['face-mask'].name} and paid ${emotes.kr}${market.items['face-mask'].displayprice}`)
                .setFooter('Rip krunkitis'));
        } else if (args[0].toLowerCase() === 'cure' || args[0].toLowerCase() === 'antidote') {
            if (wallet < parseInt(market.items.antidote.price)) return message.reply(`You do not have ${emotes.kr}${market.items.antidote.displayprice} in your wallet!`);
            await db.utils.addSkin(message.author.id, parseInt(1659));
            await db.utils.addKR(message.author.id, -parseInt(market.items.antidote.price));
            message.channel.send(new MessageEmbed()
                .setAuthor(`Successfully purchased ${market.items.antidote.name}`)
                .setColor('GREEN')
                .setDescription(`<@${message.author.id}> bought ${emotes.antidote}${market.items.antidote.name} and paid ${emotes.kr}${market.items.antidote.displayprice}`)
                .setFooter('Krunkitis going extinct now'));
        } else if (args[0].toLowerCase() === 'asokra' || (args[0].toLowerCase() === 'asokra\'s' && args[1].toLowerCase() === 'trophy' && args[2].toLowerCase() === 'case')) {
            if (wallet < parseInt(market.items.asokra.price)) return message.reply(`You do not have ${emotes.kr}${market.items.asokra.displayprice} in your wallet!`);
            await db.utils.addItem(message.author.id, parseInt(1));
            await db.utils.addKR(message.author.id, -parseInt(market.items.asokra.displayprice));
            message.channel.send(new MessageEmbed()
                .setAuthor(`Successfully purchased ${market.items.asokra.name}`)
                .setColor('GREEN')
                .setDescription(`<@${message.author.id}> bought ${market.items.asokra.icon}${market.items.asokra.name} and paid ${emotes.kr}${market.items.asokra.displayprice}`)
                .setFooter('Professional comp player now'));
        } else if (args[0].toLowerCase() === 'koma' || args.splice(1).join(' ').toLowerCase() === 'koma\'s green penguin of doom') {
            if (wallet < parseInt(market.items.asokra.price)) return message.reply(`You do not have ${emotes.kr}${market.items.asokra.displayprice} in your wallet!`);
            await db.utils.addItem(message.author.id, parseInt(2));
            await db.utils.addKR(message.author.id, -parseInt(market.items.koma.displayprice));
            message.channel.send(new MessageEmbed()
                .setAuthor(`Successfully purchased ${market.items.koma.name}`)
                .setColor('GREEN')
                .setDescription(`<@${message.author.id}> bought ${market.items.koma.icon}${market.items.koma.name} and paid ${emotes.kr}${market.items.koma.displayprice}`)
                .setFooter('Let the destruction begin'));
        } else
            message.reply('What are you doing , that item does not exist');
    },
};
