const { MessageEmbed } = require('discord.js'),
    Skins = require('../../modules/skins'),
    { emotes, staff, testers, devs } = require('../../data'),
    db = require('../../modules'),
    { createEmbed, parse } = require('../../modules/messageUtils'),
    marketDB = require('../../mongo/market/market');

module.exports = {
    name: 'list',
    aliases: [],
    cooldown: 20,
    description: 'Own way too many skins? Use this command to sell some of them',
    expectedArgs: 'k/sell (skin name)',
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || testers.includes(message.author.id))) return;
        const user = await db.utils.get(message.author.id);
        if (!args[0]) return message.reply('How much are you selling it for');
        const price = parse(args[0], user.balance);
        if (isNaN(price)) return message.reply(createEmbed(message.author, 'RED', 'Provide a valid amount, don\'t try to break me'));
        if (price < 10) return message.reply(createEmbed(message.author, 'RED', `The minimum amount that you can list a skin for is ${emotes.kr}10`));
        if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'What are you selling lmao'));
        if (user.inventory.skins.length == 0) return message.reply(createEmbed(message.author, 'RED', 'You don\'t have any skins to sell lmao'));
        const arg = args.splice(1).join(' ').toLowerCase();
        const foundSkin = await Skins.allSkins.find(x => x.name.toLowerCase() == arg);
        if (foundSkin == undefined) return message.channel.send(createEmbed(message.author, 'RED', 'Unknown skin'));
        const index = user.inventory.skins.findIndex(x => x === foundSkin.index);

        if (index == -1) // If skin not found
            return message.reply(createEmbed(message.author, 'RED', 'You don\'t have that skin!'));
        user.inventory.skins.splice(index, 1);
        const skinInfo = { index: foundSkin.index, price: parseInt(price), userID: message.author.id, name: foundSkin.name, rarity: foundSkin.rarity };
        await marketDB.utils.listSkin(1, skinInfo);
        await db.set(message.author.id, user);
        console.log(index);
        message.reply(new MessageEmbed()
            .setTitle('Succesfully listed skin!')
            .setColor('GREEN')
            .setDescription(`${Skins.emoteColorParse(foundSkin.rarity)} ${foundSkin.name} was listed for ${emotes.kr} ${price}`)
            .setFooter('stonks4u'),
        );
    },
};

