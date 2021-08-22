import Skins from '../../modules/skins.js';
import dat from '../../data/index.js';
import { MessageEmbed } from 'discord.js';
import db from '../../modules/db/economy.js';
import utils from '../../modules/utils.js';
import { addXP } from '../../modules/db/levels.js';
import msgUtils from '../../modules/messageUtils.js';


export default {
    name: 'spin',
    aliases: ['heroic'],
    cooldown: 10,
    description: 'Addicted to in-game spins? Have an unquenchable thirst for gambling? This command is the one for you! Use bot currency to unbox tons of amazing skins! The chances of unboxing a certain rarity are very similar to the chances in the game itself',
    expectedArgs: 'k/spin',
    execute: async(message) => {
        const { wallet } = await db.utils.balance(message.author.id);
        if (wallet < 500) return message.channel.send(msgUtils.createEmbed(message.author, 'RED', `you do not have ${dat.emotes.kr}500 to do a heroic spin`));
        const randomSkin = utils.getRandomRaritySkin();
        await db.utils.addKR(message.author.id, -parseInt(500));
        if (randomSkin.index == 1659)
            await db.utils.addItem(message.author.id, 3);
        else if (randomSkin.index == 944)
            await db.utils.addItem(message.author.id, 2);
        else
            await db.utils.addSkin(message.author.id, randomSkin.index);

        message.reply({ embeds: [new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`${dat.emotes.kr} Heroic Spin`)
            .setColor(`${Skins.colorParse(randomSkin.rarity)}`)
            .setDescription(`You unboxed **${randomSkin.name}**!`)
            .addFields(
                { name: 'Rarity', value: `${Skins.emoteColorParse(randomSkin.rarity)}`, inline: true },
                { name: 'Creator', value: `${randomSkin.creator || 'Krunker.io'}`, inline: true },
                { name: 'Season', value: `${randomSkin.season || '1'}`, inline: true },
            )
            .setThumbnail(Skins.getPreview(randomSkin))
            .setFooter('Feeding your gambling addiction ™')], allowedMentions: { repliedUser: false } });
        addXP(message.author.id, 23, message);
        await db.utils.addSpinCount(message.author.id, 1);
    },
};
