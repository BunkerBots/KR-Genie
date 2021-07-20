/* eslint-disable no-unused-vars */
import { MessageEmbed } from 'discord.js';
import data from '../../data/index.js';
import db from '../../modules/db/economy.js';
import Skins from '../../modules/skins.js';
import { createEmbed } from '../../modules/messageUtils.js';
import { resolveRarity } from '../../modules/utils.js';


export default {
    name: 'bulksell',
    aliases: ['bsell'],
    cooldown: 5,
    description: 'Sell skins based on rarities',
    expectedArgs: 'k/bulksell [rarity]',
    execute: async(message, args) => {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'What rarity are you selling?'));
        const rarity = resolveRarity(args[0]);
        if (rarity === undefined) return message.reply(createEmbed(message.author, 'RED', 'Unknown rarity'));
        const user = await db.utils.get(message.author.id);
        let rarityCount = 0;
        user.inventory.skins = user.inventory.skins.map(x => Skins.allSkins[x]).sort((a, b) => a.rarity - b.rarity).reverse()
            .filter(x => {
                if (x.rarity == rarity) {
                    rarityCount += 1;
                    return false;
                }
                return true;
            }).map(x => x.index);
        const rates = [1, 25, 150, 500, 2500, 10000, 100000];
        const price = rates[rarity];
        const totalPrice = parseInt(price * rarityCount);
        user.balance.bank += totalPrice;
        console.log(user);
        await db.set(message.author.id, user);
        message.reply(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Sold ${rarityCount} ${Skins.textColorParse(rarity)} for ${data.emotes.kr}${totalPrice}`)
            .setColor('GREEN'));
    },
};
