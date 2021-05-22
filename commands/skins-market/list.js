import { MessageEmbed } from 'discord.js';
import Skins from '../../modules/skins.js';
import { emotes, staff, testers, devs } from '../../data/index.js';
import db from '../../modules/db.js';
import { createEmbed, parse } from '../../modules/messageUtils.js';
import marketDB from '../../mongo/market/market.js';


export default {
    name: 'list',
    aliases: [],
    cooldown: 10,
    description: 'Own way too many skins? List some of them on the market using this command',
    expectedArgs: 'k/list (amount) (skin name)',
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
        const tenpercent = Math.ceil(10 * price / 100);
        if (tenpercent > user.balance.wallet) return message.channel.send(createEmbed(message.author, 'RED', `You do not have the listing fee ${emotes.kr}${tenpercent} in your wallet`));
        user.balance.wallet -= parseInt(tenpercent);
        user.inventory.skins.splice(index, 1);
        let id;
        if (await marketDB.utils.getListingID(1) != undefined) id = parseInt(await marketDB.utils.getListingID(1) + 1);
        else id = parseInt(1);
        const skinInfo = { index: foundSkin.index, price: parseInt(price), userID: message.author.id, name: foundSkin.name, rarity: foundSkin.rarity, id: id };
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

