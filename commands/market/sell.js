const { MessageEmbed } = require('discord.js'),
    Skins = require('../../modules/skins'),
    { emotes } = require('../../data'),
    db = require('../../modules'),
    { createEmbed } = require('../../modules/messageUtils');

const rates = [1, 25, 150, 500, 2500, 10000, 100000];
module.exports = {
    name: 'sell',
    aliases: ['ditch', 'throw', 'quicksell'],
    cooldown: 20,
    description: 'Own way too many skins? Use this command to sell some of them',
    expectedArgs: 'k/sell (skin name)',
    execute: async(message, args) => {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'What are you selling lmao'));
        const user = await db.utils.get(message.author.id);
        if (user.inventory.skins.length == 0) return message.reply(createEmbed(message.author, 'RED', 'You don\'t have any skins to sell lmao'));
        const arg = args.join(' ').toLowerCase();
        const foundSkin = await Skins.allSkins.find(x => x.name.toLowerCase() == arg);
        if (foundSkin == undefined) return message.channel.send(createEmbed(message.author, 'RED', 'Unknown skin'));
        const index = user.inventory.skins.findIndex(x => x === foundSkin.index);

        if (index == -1) // If skin not found
            return message.reply(createEmbed(message.author, 'RED', 'You don\'t have that skin!'));
        user.inventory.skins.splice(index, 1);
        const price = rates[foundSkin.rarity];
        if (!price) throw new Error('INVALID PRICE!', foundSkin);
        user.balance.bank += price;
        await db.set(message.author.id, user);
        console.log(index);
        message.reply(new MessageEmbed()
            .setTitle('Succesfully quicksold!')
            .setColor('GREEN')
            .setDescription(`${Skins.emoteColorParse(foundSkin.rarity)} ${foundSkin.name} was sold for ${emotes.kr} ${price}`)
            .setFooter('stonks4u'),
        );
    },
};

