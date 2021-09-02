import { createEmbed } from '../../modules/messageUtils.js';
import Skins from '../../modules/skins.js';
import db from '../../modules/db/economy.js';
import { MessageEmbed } from 'discord.js';
import { getLevel } from '../../modules/db/levels.js';
import marketDB from '../../modules/db/market.js';
const { allSkins } = Skins;

export default {
    name: 'trade',
    aliases: ['trade'],
    cooldown: 5,
    description: 'A command to trade your skins',
    expectedArgs: 'k/trade [ID / @user]',
    execute: async(message, args) => {
        let authorSkin, userSkin, authorSkinName, userSkinName;
        // ------------- Finding target ------------- //
        if (!args[0]) return message.channel.send('Who are you gonna trade with??');
        const user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.reply(createEmbed(message.author, 'RED', 'Unknown user'));
        // if (user.id === message.author.id) return message.channel.send('You can\'t trade with yourself...');
        const authorLevel = await getLevel(message.author.id);
        const userLevel = await getLevel(user.id);
        if (authorLevel < 5 || userLevel < 5) return message.channel.send(createEmbed(message.author, 'RED', 'User must be level 5 or higher to trade / accept trades'));

        // ------------- Fee ------------- //
        const { wallet } = await db.utils.balance(message.author.id);
        if (parseInt(wallet) < 1000) return message.reply(createEmbed(message.author, 'RED', 'You don\'t have the trade fee 1000 KR in your wallet'));

        // ------------- Skins ------------- //
        const authorInv = await db.utils.skinInventory(message.author.id);
        const userInv = await db.utils.skinInventory(user.id);

        // ------------- Collector ------------- //
        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter,
            { time: 20000 });
        const collector2 = message.channel.createMessageCollector(filter,
            { time: 20000 });

        // ------------- Embeds ------------- //
        const time = createEmbed(message.author, 'RED', 'Trade time out, try again');
        const embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Sending a trade to ${user.username}`)
            .addField('Your Skin', 'To be selected', true)
            .addField('\u200b', '<=>', true)
            .setColor('GOLD')
            .addField(`${user.username}'s Skin`, 'To be selected', true)
            .setFooter('Please pick a skin from your inventory');
        await message.channel.send({ embeds: [embed] });

        // ------------- Init trade ------------- //
        collector.on('collect', async(recvMsg) => {
            if (recvMsg.author.id !== message.author.id) return;
            const skin = recvMsg.content.toLowerCase();
            const found = await allSkins.find(x => x.name.toLowerCase() == skin);
            if (found == undefined) return message.channel.send(createEmbed(message.author, 'RED', 'Unknown skin'));
            const foundSkinInInventory = authorInv.find(x => x == found.index);
            if (!foundSkinInInventory) return message.channel.send(createEmbed(message.author, 'RED', 'You do not have that skin in your inventory'));
            authorSkin = found.index;
            // message.channel.send('Picked' + ` ${skin}`);
            authorSkinName = `${Skins.emoteColorParse(found.rarity)} ${skin}`;
            const newembed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`Sending a trade to ${user.username}`)
                .addField('Your Skin', `${authorSkinName}`, true)
                .addField('\u200b', '<=>', true)
                .setColor('GOLD')
                .addField(`${user.username}'s Skin`, 'To be selected', true)
                .setFooter(`Please pick a skin from ${user.username}'s inventory`);
            // embedmsg.edit(newembed);
            message.channel.send({ embeds: [newembed] });
            collector.stop();
        });
        collector.on('end', (_, reason) => {
            if (reason === 'time') return message.channel.send(time);

            collector2.on('collect', async recvMsg => {
                if (recvMsg.author.id !== message.author.id) return;
                const skin = recvMsg.content.toLowerCase();
                const found = await allSkins.find(x => x.name.toLowerCase() == skin);
                if (found == undefined) return message.channel.send(createEmbed(message.author, 'RED', 'Unknown skin'));
                const foundSkinInInventory = userInv.find(x => x == found.index);
                if (!foundSkinInInventory) return message.channel.send(createEmbed(message.author, 'RED', `${user.username} does not have that skin in their inventory`));
                userSkin = found.index;
                // message.channel.send(`picked ${skin}`);
                userSkinName = `${Skins.emoteColorParse(found.rarity)} ${skin}`;
                const newembed = new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`✅ Sent a trade to ${user.username}`)
                    .addField('Your Skin', `${authorSkinName}`, true)
                    .addField('\u200b', '<=>', true)
                    .setColor('GREEN')
                    .addField(`${user.username}'s Skin`, `${userSkinName}`, true);
                // embedmsg.edit(newembed);
                message.channel.send({ embeds: [newembed] });
                collector2.stop();
            });

            collector2.on('end', async(__, r) => {
                if (r === 'time') return message.channel.send(time);
                /**
                 * author skin = the skin that belongs to the trade sender
                 * user skin = the skin that belongs to the user that recieves the trade
                 */
                const id = await marketDB.utils.getTradeID(1);
                const data = { to: user.id, tradeID: id, author: message.author.id, userSkin: userSkin, authorSkin: authorSkin };
                await db.utils.addTrade(user.id, data);
                await db.utils.addTrade(message.author.id, data);
                await marketDB.utils.incrementTradeID(1);
                await db.utils.addKR(message.author.id, -parseInt(1000));
            });
        });
        // const authorSkin = await initAuthorTrade(collector, message, authorInv)initUserTrade(collector, message, userInv, user);
    }
};

/**
 * Legend
 * to : to whom the trade is being sent to
 * author : the person who sent the trade
 * userSkin : skin from the person's inventory who is recieveing the trade
 * authorSkin : skin from the senders inventory
 */
