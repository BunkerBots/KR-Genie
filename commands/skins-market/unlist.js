const { MessageEmbed } = require('discord.js'),
    Skins = require('../../modules/skins'),
    { emotes, devs, staff, testers } = require('../../data'),
    db = require('../../modules'),
    { createEmbed, parse } = require('../../modules/messageUtils'),
    marketDB = require('../../mongo/market/market');

module.exports = {
    name: 'unlist',
    aliases: [],
    cooldown: 20,
    description: 'Own way too many skins? Use this command to sell some of them',
    expectedArgs: 'k/sell (skin name)',
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || testers.includes(message.author.id))) return;
        const user = await db.utils.get(message.author.id);
        if (!args[0]) return message.reply('What are paying for the skin lmao');
        const price = parse(args[0], user.balance);
        if (isNaN(price)) message.reply('dont try to break me bitch');
        if (!args[1]) return message.reply('Which skin are you buying');
        const listings = await marketDB.utils.getListing(1);
        const arg = args.splice(1).join(' ').toLowerCase();
        const foundSkin = await listings.find(x => x.name.toLowerCase() == arg);
        if (foundSkin == undefined) return message.channel.send(createEmbed(message.author, 'RED', 'That skin has not been listed'));
        const foundPrice = await listings.find(x => x.price == price);
        console.log(foundSkin);
        if (foundPrice == undefined) return message.channel.send(createEmbed(message.author, 'RED', 'A skin has not been listed for that price'));
        if (foundPrice < user.balance.wallet) return message.channel.send(createEmbed(message.author, 'RED', `You do not have ${emotes.kr}${price} in your wallet`));
        if (foundSkin.userID != message.author.id) return message.reply('That skin was not listed by you');
        await user.inventory.skins.push(foundSkin.index);
        const market = await marketDB.utils.get(1);
        const itemIndex = market.items.findIndex(x => x.index == foundSkin.index && x.price == price);
        market.items.splice(itemIndex, 1);
        await marketDB.set(1, market);
        await db.set(message.author.id, user);
        message.reply(new MessageEmbed()
            .setTitle('Succesfully Unlisted Skin!')
            .setColor('GREEN')
            .setDescription(`${Skins.emoteColorParse(foundSkin.rarity)} ${foundSkin.name} was unlised!`)
            .setFooter('stonks4u'),
        );
    },
};

