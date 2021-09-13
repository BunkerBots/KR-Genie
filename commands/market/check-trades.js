/* eslint-disable no-unused-vars */
import db from '../../modules/db/economy.js';
import Skins from '../../modules/skins.js';
import { core, timeout } from '../../data/index.js';
import Paginator from '../../modules/paginator.js';
import { createEmbed, disableComponents, getID } from '../../modules/messageUtils.js';
import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';

export default {
    name: 'trades',
    aliases: ['trades'],
    cooldown: 5,
    description: 'A command to view trade offers, accept / cancel or decline trades',
    expectedArgs: 'k/trades\nk/trades accept tradeID\nk/trades decline tradeID\nk/trades cancel tradeID',
    execute: async(message, args, bot) => {
        if (!args[0]) {
            const tradesArr = [];

            const lastPage = Math.ceil(tradesArr.length / 10);
            const options = { author: message.author, current: 1, maxValues: tradesArr.length, max: lastPage };

            const trades = await db.utils.getTrades(message.author.id);
            for (const i of trades) {
                const authorSkin = Skins.allSkins[i.authorSkin];
                const userSkin = Skins.allSkins[i.userSkin];
                // const dat = {
                //     author: x.author,
                //     id: x.tradeID,
                //     to: x.to,
                //     toDat: `${Skins.emoteColorParse(authorSkin.rarity)} ${authorSkin.name} \`↔️\` ${Skins.emoteColorParse(userSkin.rarity)} ${userSkin.name}`,
                //     fromDat: `${Skins.emoteColorParse(userSkin.rarity)} ${userSkin.name} \`↔️\` ${Skins.emoteColorParse(authorSkin.rarity)} ${authorSkin.name}`,

                // };
                // const id =  i.tradeID;
                // const to = i.to;
                const toDat = `${Skins.emoteColorParse(authorSkin.rarity)} ${authorSkin.name} \`↔️\` ${Skins.emoteColorParse(userSkin.rarity)} ${userSkin.name}`;
                const fromDat = `${Skins.emoteColorParse(userSkin.rarity)} ${userSkin.name} \`↔️\` ${Skins.emoteColorParse(authorSkin.rarity)} ${authorSkin.name}`;

                const fro = await getID(i.to);
                const user = await getID(i.author);
                const froto = i.to === message.author.id ? `From ${user.username}` : `To ${fro.username}`;
                const frotofield = i.to === message.author.id ? fromDat : toDat;
                // embed.addField(`${froto}`, `${frotofield}\n\`Trade ID: ${i.id}\`\n\u200b`);
                const field = `${frotofield}\n\`Trade ID: ${i.tradeID}\`\n\u200b`;
                tradesArr.push({ id: i.tradeID, froto: froto, field: field });
            }
            // const embeds = new StaticEmbeds(message, tradesArr, false, args);
            // embeds.generateMultilineEmbed('Your trades', 'Trades');
            const paginator = new Paginator(bot, message.channel, options, async(i, dat) => {
                const final = [...tradesArr].slice(i, i + 10);
                const embed = new MessageEmbed()
                    .setAuthor(`Requested by ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
                    .setFooter(`${dat.page} out of ${lastPage}`)
                    .setTitle('Your trades')
                    .setColor(core.embed);
                for (const x of final)
                    embed.addField(`${x.froto}`, `${x.field}`);

                return { embeds: [embed] }; // return embed
            });
            await paginator.start();
        } else if (args[0]) {
            if (isNaN(parseInt(args[0]))) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
            const trades = await db.utils.getTrades(message.author.id);
            const found = trades.find(x => x.tradeID == args[0]);
            if (found == undefined) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
            const tradesArr = await getTrades(message);
            const trade = tradesArr.find(x => x.id == args[0]);
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
                .setTitle('Your trades')
                .addField(`${trade.froto}`, `${trade.field}`)
                .setColor(core.embed);

            const row = [];
            const name = [{ name: 'Accept', style: 'SUCCESS' }, { name: 'Cancel', style: 'PRIMARY' }, { name: 'Decline', style: 'DANGER' }];
            for (let i = 0; i < 3; i++) {
                const el = name[i];
                const btn = new MessageButton().setLabel(el.name).setStyle(el.style).setCustomId(el.name);
                row.push(btn);
            }
            if (found.author != message.author.id) row[1].setDisabled(true);


            const embedmsg = await message.reply({ embeds: [embed], components: [new MessageActionRow().addComponents(...row)], failIfNotExists: false });

            const collector = embedmsg?.createMessageComponentCollector({ componentType: 'BUTTON', time: timeout['trade'] });

            collector.on('collect', async i => {
                if (await global.handleInteraction(i, message)) return;
                // if (i.user.id !== message.author.id) return i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
                if (i.customId == 'Accept') acceptTrade(message, args, i);
                else if (i.customId == 'Cancel') cancelTrade(message, args, i);
                else if (i.customId == 'Decline') declineTrade(message, args, i);
                embedmsg.delete();
            });

            collector.on('end', () => {
                disableComponents(embedmsg);
            });
        }
    }
};

async function acceptTrade(message, args, i) {
    // if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'You need to provide the trade ID'));
    // if (isNaN(parseInt(args[1]))) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const replyMsg = await i.reply({ content: 'Processing...' });
    const trades = await db.utils.getTrades(message.author.id);
    const found = trades.find(x => x.tradeID == args[0]);
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
    replyMsg.deleteReply();
}

async function declineTrade(message, args, i) {
    const replyMsg = await i.reply({ content: 'Processing...' });

    // if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'You need to provide the trade ID'));
    // if (isNaN(parseInt(args[1]))) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const trades = await db.utils.getTrades(message.author.id);
    const found = trades.find(x => x.tradeID == args[0]);
    if (found == undefined) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const tradeIndex = trades.indexOf(found);
    const authorTrades = await db.utils.getTrades(found.author);
    const authorTradeIndex = authorTrades.indexOf(found);
    await db.utils.removeTrade(message.author.id, tradeIndex);
    await db.utils.removeTrade(found.author, authorTradeIndex);
    message.channel.send(createEmbed(message.author, 'GREEN', 'Successfully declined the trade'));
    // replyMsg.deleteReply();
}

async function cancelTrade(message, args, i) {
    const replyMsg = await i.reply({ content: 'Processing...' });

    // if (!args[1]) return message.reply(createEmbed(message.author, 'RED', 'You need to provide the trade ID'));
    // if (isNaN(parseInt(args[1]))) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const trades = await db.utils.getTrades(message.author.id);
    const found = trades.find(x => x.tradeID == args[0]);
    if (found == undefined) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid trade ID'));
    const tradeIndex = trades.indexOf(found);
    const authorTrades = await db.utils.getTrades(found.author);
    const authorTradeIndex = authorTrades.indexOf(found);
    if (found.author != message.author.id) return message.reply(createEmbed(message.author, 'RED', 'You cannot cancel trades that aren\'t yours, try using `decline` instead'));
    await db.utils.removeTrade(message.author.id, tradeIndex);
    await db.utils.removeTrade(found.to, authorTradeIndex);
    message.channel.send(createEmbed(message.author, 'GREEN', 'Success'));
    // replyMsg.deleteReply();
}

async function getTrades(message) {
    const tradesArr = [];
    const trades = await db.utils.getTrades(message.author.id);
    for (const i of trades) {
        const authorSkin = Skins.allSkins[i.authorSkin];
        const userSkin = Skins.allSkins[i.userSkin];
        const toDat = `${Skins.emoteColorParse(authorSkin.rarity)} ${authorSkin.name} \`↔️\` ${Skins.emoteColorParse(userSkin.rarity)} ${userSkin.name}`;
        const fromDat = `${Skins.emoteColorParse(userSkin.rarity)} ${userSkin.name} \`↔️\` ${Skins.emoteColorParse(authorSkin.rarity)} ${authorSkin.name}`;

        const fro = await getID(i.to);
        const user = await getID(i.author);
        const froto = i.to === message.author.id ? `From ${user.username}` : `To ${fro.username}`;
        const frotofield = i.to === message.author.id ? fromDat : toDat;
        // embed.addField(`${froto}`, `${frotofield}\n\`Trade ID: ${i.id}\`\n\u200b`);
        const field = `${frotofield}\n\`Trade ID: ${i.tradeID}\`\n\u200b`;
        tradesArr.push({ id: i.tradeID, froto: froto, field: field });
    }
    return tradesArr;
}
