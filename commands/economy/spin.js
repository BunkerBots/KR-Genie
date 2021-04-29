const Skins = require('../../modules/skins');
const dat = require('../../data');
const { MessageEmbed } = require('discord.js');
const db = require('../../modules');
const utils = require('../../modules/utils'),
    levels = require('../../mongo');
module.exports = {
    name: 'spin',
    aliases: ['heroic'],
    cooldown: 10,
    description: `Addicted to in-game spins? Have an unquenchable gambling addiction? This command is the one for you, use bot currency ${dat.emotes.kr} to unbox tons of amazing skins, similar to in-game spin chances`,
    expectedArgs: 'k/spin',
    execute: async(message) => {
        // if (!dat.testers.includes(message.author.id)) return message.reply('This command is only available for Beta Testers , contact EJ BEAN#3961 to be a part of beta test!')
        const { wallet } = await db.utils.balance(message.author.id);
        if (wallet < 500) return message.channel.send('you do not have 500kr to do a heroic spin (beta)');
        const randomSkin = utils.getRandomRaritySkin();
        // const weap = randomSkin.weapon || '';
        await db.utils.addKR(message.author.id, -parseInt(500));
        await db.utils.addSkin(message.author.id, randomSkin.index);
        message.channel.send(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
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
