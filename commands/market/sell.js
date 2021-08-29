import { MessageEmbed } from 'discord.js';
import Skins from '../../modules/skins.js';
import { emotes } from '../../data/index.js';
import db from '../../modules/db/economy.js';
import { createEmbed } from '../../modules/messageUtils.js';
const rates = [1, 3, 10, 150, 500, 2500, 10000];


export default {
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
        message.reply({ embeds: [new MessageEmbed()
            .setTitle('Succesfully quicksold!')
            .setColor('GREEN')
            .setDescription(`${Skins.emoteColorParse(foundSkin.rarity)} ${foundSkin.name} was sold for ${emotes.kr} ${price}`)
            .setFooter('stonks4u')], allowedMentions: { repliedUser: false }
        });
    },
};

