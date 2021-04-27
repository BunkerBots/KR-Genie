const { MessageEmbed } = require('discord.js'),
    Skins = require('../../modules/skins'),
    { emotes } = require('../../data'),
    db = require('../../modules');

const rates = [0, 1, 5, 13, 100, 500, 2500, 10000];
module.exports = {
    name: 'sell',
    aliases: ['ditch', 'throw'],
    cooldown: 25,
    execute: async(message, args) => {
        if (!args[0]) return message.reply('What are you selling lmao');
        const user = await db.utils.get(message.author.id);
        if (user.inventory.skins.length == 0) return message.reply('You don\'t have any skins to sell lmao');
        const arg = args.join(' ').toLowerCase();
        const foundSkin = await Skins.allSkins.find(x => x.name.toLowerCase() == arg);
        if (foundSkin == undefined) return message.channel.send('Unknown skin');
        const index = user.inventory.skins.findIndex(x => x == foundSkin.index);
        if (index == -1) // If skin not found
            return message.reply('You don\'t have that skin!');
        user.inventory.skins = user.inventory.skins.splice(index, 1);
        const price = rates[foundSkin.rarity];
        if (!price) throw new Error('INVALID PRICE!', foundSkin);
        user.balance.wallet += price;
        await db.set(message.author.id, user);
        message.reply(new MessageEmbed()
            .setTitle('Succesfully quicksold!')
            .setColor('GREEN')
            .setDescription(`${Skins.emoteColorParse(foundSkin.rarity)} ${foundSkin.name} was sold for ${emotes.kr} ${price}`)
            .setFooter('stonks4u'),
        );
    },
};

