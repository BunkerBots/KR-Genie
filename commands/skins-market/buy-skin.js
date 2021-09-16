import { MessageEmbed } from 'discord.js';
import Skins from '../../modules/skins.js';
// eslint-disable-next-line no-unused-vars
import { emotes, devs, staff, testers } from '../../data/index.js';
import db from '../../modules/db/economy.js';
import notify from '../../modules/notification.js';
import { createEmbed } from '../../modules/messageUtils.js';
import marketDB from '../../modules/db/market.js';
import comma from '../../modules/comma.js';
import { init, processRequests, isFirstRequest } from '../../modules/requests.js';

export default {
    name: 'buyskin',
    aliases: ['bskin'],
    cooldown: 10,
    description: 'Use this command to buy skins from the market',
    expectedArgs: 'k/buyskin (item ID)',
    execute: async(message, args) => {
        // gathering vars to init sales
        const user = await db.utils.get(message.author.id);
        if (!args[0]) return message.channel.send(createEmbed(message.author, 'RED', 'Please provide the item ID'));
        if (isNaN(args[0])) return message.channel.send(createEmbed(message.author, 'RED', 'Provide the item ID, don\'t try to break me nerd'));
        const listings = await marketDB.utils.getListing(1);
        const foundSkin = await listings.find(x => x.id == parseInt(args[0]));

        // foolproof check

        if (foundSkin == undefined) return message.channel.send(createEmbed(message.author, 'RED', 'Unknown skin'));
        if (foundSkin.price > user.balance.wallet) return message.channel.send(createEmbed(message.author, 'RED', `You do not have ${emotes.kr}${foundSkin.price} in your wallet`));
        if (foundSkin.userID == message.author.id) return message.reply(createEmbed(message.author, 'RED', 'Dude what? you can\'t buy your own skin'));

        let firstRequest;
        // init request queue
        const reqQ = init(message.author.id, foundSkin.index);
        console.log(reqQ);
        const processing = await message.reply({ content: 'processing' });
        if (isFirstRequest(message.author.id, foundSkin.index)) {
            firstRequest = await processRequests(foundSkin.index);
            await buy(firstRequest);
        }

        let desc, color, title, footer;
        if (firstRequest != message.author.id) {
            color = 'RED',
            desc = 'Error';
            title = 'Failed';
            footer = 'notstonks';
        } else {
            color = 'GREEN',
            title = 'Succesfully Bought Skin!';
            footer = 'Thank you for the purchase';
            desc = `${Skins.emoteColorParse(foundSkin.rarity)} ${foundSkin.name} was bought for ${emotes.kr} ${foundSkin.price}`;
        }
        // success / fail embed;
        processing.delete();
        message.reply({ embeds: [new MessageEmbed()
            .setTitle(title.toString())
            .setColor(color.toString())
            .setDescription(desc.toString())
            .setFooter(footer.toString())], failIfNotExists: false }
        );

        // notfiy user of the sale
        const target = await message.client.users.fetch(`${foundSkin.userID}`).catch(() => {});
        notify(target, 'Bought Skin', `${message.author.tag} purchased your skin, ${Skins.emoteColorParse(foundSkin.rarity)}${foundSkin.name} for ${emotes.kr}${comma(foundSkin.price)}`, 'GREEN', 'stonks');

        async function buy(firstUser) {
            const winner = await db.utils.get(firstUser);
            const market = await marketDB.utils.get(1);
            const itemIndex = market.items.findIndex(x => x.id == foundSkin.id);
            market.items.splice(itemIndex, 1);
            await marketDB.set(1, market);
            await winner.inventory.skins.push(foundSkin.index);
            winner.balance.wallet -= parseInt(foundSkin.price);
            await db.set(firstUser, winner);
            await db.utils.addKrToBank(foundSkin.userID, foundSkin.price);
            return true;
        }
    },
};

