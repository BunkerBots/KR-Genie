import { MessageEmbed } from 'discord.js';
import Skins from '../../modules/skins.js';
// eslint-disable-next-line no-unused-vars
import { devs, staff, testers } from '../../data/index.js';
import db from '../../modules/db/economy.js';
import { createEmbed } from '../../modules/messageUtils.js';
import marketDB from '../../modules/db/market.js';

export default {
    name: 'unlist',
    aliases: ['unlistskin'],
    cooldown: 10,
    description: 'Changed your mind? Unlist your skin that has been listed',
    expectedArgs: 'k/unlist (item ID)',
    execute: async(message, args) => {
        // if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || testers.includes(message.author.id))) return;
        const user = await db.utils.get(message.author.id);
        if (!args[0]) return message.channel.send(createEmbed(message.author, 'RED', 'You need to provide an item ID..'));
        // const price = parse(args[0], user.balance);
        // if (isNaN(price)) message.reply('dont try to break me bitch');
        // if (!args[1]) return message.reply('Which skin are you buying');
        const listings = await marketDB.utils.getListing(1);
        // const arg = args.splice(1).join(' ').toLowerCase();
        const foundSkin = await listings.find(x => x.id == parseInt(args[0]));
        if (foundSkin == undefined) return message.channel.send(createEmbed(message.author, 'RED', 'That skin has not been listed'));
        // const foundPrice = await listings.find(x => x.price == price);
        // console.log(foundSkin);
        // if (foundPrice == undefined) return message.channel.send(createEmbed(message.author, 'RED', 'A skin has not been listed for that price'));
        // if (foundPrice < user.balance.wallet) return message.channel.send(createEmbed(message.author, 'RED', `You do not have ${emotes.kr}${price} in your wallet`));
        if (foundSkin.userID != message.author.id) return message.channel.send(createEmbed(message.author, 'RED', 'That skin was not listed by you'));
        await user.inventory.skins.push(foundSkin.index);
        const market = await marketDB.utils.get(1);
        const itemIndex = market.items.findIndex(x => x.id == foundSkin.id);
        market.items.splice(itemIndex, 1);
        await marketDB.set(1, market);
        await db.set(message.author.id, user);
        message.reply({ embeds: [new MessageEmbed()
            .setTitle('Succesfully Unlisted Skin!')
            .setColor('GREEN')
            .setDescription(`${Skins.emoteColorParse(foundSkin.rarity)} ${foundSkin.name} was unlisted!`)
            .setFooter('stonks4u')], failIfNotExists: false }
        );
    },
};

