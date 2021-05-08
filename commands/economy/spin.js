const Skins = require('../../modules/skins');
const dat = require('../../data');
const { MessageEmbed } = require('discord.js');
const db = require('../../modules');
const utils = require('../../modules/utils'),
    // eslint-disable-next-line no-unused-vars
    levels = require('../../mongo'),
    embeds = require('../../modules/messageUtils');
module.exports = {
    name: 'spin',
    aliases: ['heroic'],
    cooldown: 10,
    description: 'Addicted to in-game spins? Have an unquenchable thirst for gambling? This command is the one for you! Use bot currency to unbox tons of amazing skins! The chances of unboxing a certain rarity are very similar to the chances in the game itself',
    expectedArgs: 'k/spin',
    execute: async(message) => {
        // if (!dat.testers.includes(message.author.id)) return message.reply('This command is only available for Beta Testers , contact EJ BEAN#3961 to be a part of beta test!')
        const { wallet } = await db.utils.balance(message.author.id);
        if (wallet < 500) return message.channel.send(await embeds.createEmbed(message.author, 'RED', `you do not have ${dat.emotes.kr}500 to do a heroic spin`));
        const randomSkin = utils.getRandomRaritySkin();
        // const weap = randomSkin.weapon || '';
        await db.utils.addKR(message.author.id, -parseInt(500));
        if (randomSkin.index == 1659)
            await db.utils.addItem(message.author.id, 3);
        else if (randomSkin.index == 944)
            await db.utils.addItem(2);
        else
            await db.utils.addSkin(message.author.id, randomSkin.index);

        // await db.utils.addSkin(message.author.id, randomSkin.index);
        message.channel.send(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setTitle(`${dat.emotes.kr} Heroic Spin`)
            .setColor(`${Skins.colorParse(randomSkin.rarity)}`)
            .setDescription(`You unboxed **${randomSkin.name}**!`) // | **${await type}**`)
            .addFields(
                { name: 'Rarity', value: `${Skins.emoteColorParse(randomSkin.rarity)}`, inline: true },
                { name: 'Creator', value: `${randomSkin.creator || 'Krunker.io'}`, inline: true },
                { name: 'Season', value: `${randomSkin.season || '1'}`, inline: true },
            )
            .setThumbnail(Skins.getPreview(randomSkin))
            .setFooter('Feeding your gambling addiction ™'));
        levels.addXP(message.author.id, 23, message);
    },
};
