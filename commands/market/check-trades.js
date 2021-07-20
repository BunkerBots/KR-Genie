import db from '../../modules/db/economy.js';
import Skins from '../../modules/skins.js';
import { StaticEmbeds } from '../../modules/index.js';
import { createEmbed } from '../../modules/messageUtils.js';
export default {
    name: 'trades',
    aliases: [],
    cooldown: 5,
    description: 'A place where you can purchase various useful items',
    expectedArgs: 'k/shop',
    execute: async(message, args) => {
        if (!args[0]) {
            const tradesArr = [];
            const trades = await db.utils.getTrades(message.author.id);
            trades.forEach(x => {
                const authorSkin = Skins.allSkins[x.authorSkin];
                const userSkin = Skins.allSkins[x.userSkin];
                const dat = {
                    author: x.author,
                    id: x.tradeID,
                    to: x.to,
                    toDat: `${Skins.emoteColorParse(authorSkin.rarity)} ${authorSkin.name} \`↔️\` ${Skins.emoteColorParse(userSkin.rarity)} ${userSkin.name}`,
                    fromDat: `${Skins.emoteColorParse(userSkin.rarity)} ${userSkin.name} \`↔️\` ${Skins.emoteColorParse(authorSkin.rarity)} ${authorSkin.name}`,

                };
                tradesArr.push(dat);
            });
            const embeds = new StaticEmbeds(message, tradesArr, false, args);
            embeds.generateMultilineEmbed('Your trades', 'Trades');
            return;
        }

        if (args[0].toLowerCase() == 'accept') return await acceptTrade(message, args);
        else if (args[0].toLowerCase() == 'decline') return await declineTrade(message, args);
        else if (args[0].toLowerCase() == 'cancel') return await cancelTrade(message, args);
    }
};

async function acceptTrade(message, args) {
    if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'You need to provide the trade ID'));
    if (isNaN(parseInt(args[1]))) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const trades = await db.utils.getTrades(message.author.id);
    const found = trades.find(x => x.tradeID == args[1]);
    if (found == undefined) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const author = found.author;
    const authorSkin = found.authorSkin;
    const userSkin = found.userSkin;
    const tradeIndex = trades.indexOf(found);
    const authorTrades = await db.utils.getTrades(found.author);
    const authorTradeIndex = authorTrades.indexOf(found);
    const authorInv = await db.utils.skinInventory(author);
    const userInv = await db.utils.skinInventory(message.author.id);
    const authorSkinIndex = authorInv.indexOf(authorSkin);
    const userSkinIndex = userInv.indexOf(userSkin);

    if (authorSkinIndex == -1 || userSkinIndex == -1) return message.reply(createEmbed(message.author, 'RED', 'Trade not possible'));
    if (found.to !== message.author.id) return message.reply(createEmbed(message.author, 'RED', 'You cannot accept a trade that you sent... wtf'));
    await db.utils.addSkin(message.author.id, authorSkin);
    await db.utils.removeSkin(author, authorSkinIndex);

    await db.utils.addSkin(author, userSkin);
    await db.utils.removeSkin(message.author.id, userSkinIndex);

    await db.utils.removeTrade(author, authorTradeIndex);
    await db.utils.removeTrade(message.author.id, tradeIndex);
    message.channel.send(createEmbed(message.author, 'GREEN', 'Success'));
}

async function declineTrade(message, args) {
    if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'You need to provide the trade ID'));
    if (isNaN(parseInt(args[1]))) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const trades = await db.utils.getTrades(message.author.id);
    const found = trades.find(x => x.tradeID == args[1]);
    if (found == undefined) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const tradeIndex = trades.indexOf(found);
    const authorTrades = await db.utils.getTrades(found.author);
    const authorTradeIndex = authorTrades.indexOf(found);
    await db.utils.removeTrade(message.author.id, tradeIndex);
    await db.utils.removeTrade(found.author, authorTradeIndex);
    message.channel.send(createEmbed(message.author, 'GREEN', 'Successfully declined the trade'));
}

async function cancelTrade(message, args) {
    if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'You need to provide the trade ID'));
    if (isNaN(parseInt(args[1]))) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const trades = await db.utils.getTrades(message.author.id);
    const found = trades.find(x => x.tradeID == args[1]);
    if (found == undefined) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const tradeIndex = trades.indexOf(found);
    const authorTrades = await db.utils.getTrades(found.author);
    const authorTradeIndex = authorTrades.indexOf(found);
    if (found.author != message.author.id) return message.reply(createEmbed(message.author, 'RED', 'You cannot cancel trades that aren\'t yours, try using `decline` instead'));
    await db.utils.removeTrade(message.author.id, tradeIndex);
    await db.utils.removeTrade(found.to, authorTradeIndex);
    message.channel.send(createEmbed(message.author, 'GREEN', 'Success'));
}
