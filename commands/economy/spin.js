const skinfetcher = require('../../modules/skins');
const dat = require('../../data');
const { MessageEmbed } = require('discord.js');
const db = require('../../modules');
module.exports = {
    name: 'spin',
    cooldown: 10,
    execute: async(message) => {
        // if (!dat.testers.includes(message.author.id)) return message.reply('This command is only available for Beta Testers , contact EJ BEAN#3961 to be a part of beta test!')
        const { wallet } = await db.utils.balance(message.author.id);
        if (wallet < 500) return message.channel.send('you do not have 500kr to do a heroic spin (beta)');
        const rarity = Math.floor(Math.random() * 10000);
        let randomskin;
        if (rarity <= 1)
            randomskin = skinfetcher.sorted[6][Math.floor(Math.random() * skinfetcher.sorted[6].length)];
        else if (rarity > 1 && rarity <= 50)
            randomskin = skinfetcher.sorted[5][Math.floor(Math.random() * skinfetcher.sorted[5].length)];
        else if (rarity > 50 && rarity <= 249)
            randomskin = skinfetcher.sorted[4][Math.floor(Math.random() * skinfetcher.sorted[4].length)];
        else if (rarity > 249 && rarity <= 1400)
            randomskin = skinfetcher.sorted[3][Math.floor(Math.random() * skinfetcher.sorted[3].length)];
        else if (rarity > 1400 && rarity <= 3500)
            randomskin = skinfetcher.sorted[2][Math.floor(Math.random() * skinfetcher.sorted[2].length)];
        else if (rarity > 3500 && rarity <= 10000)
            randomskin = skinfetcher.sorted[1][Math.floor(Math.random() * skinfetcher.sorted[1].length)];


        const preview = skinfetcher.getPreview(randomskin);
        const weaponRarity = skinfetcher.textColorParse(randomskin.rarity);
        const color = skinfetcher.colorParse(randomskin.rarity);
        // const weap = randomskin.weapon || '';
        const season = randomskin.seas || '1';
        const creator = randomskin.creator || 'Krunker.io';
        const skininfo = { name: randomskin.name.toLowerCase(), id: randomskin.id, rarity: randomskin.rarity, color: color, link: preview, seas: season, class: randomskin.weapon, index: randomskin.index };
        await db.utils.addKR(message.author.id, -parseInt(500));
        await db.utils.addSkin(message.author.id, skininfo.index);
        message.channel.send(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
            .setTitle(`${dat.emotes.kr} Heroic Spin`)
            .setColor(`${color}`)
            .setDescription(`You unboxed **${randomskin.name}**!`) // | **${await type}**`)
            .addFields(
                { name: 'Rarity', value: `${await weaponRarity}`, inline: true },
                { name: 'Creator', value: `${creator}`, inline: true },
                { name: 'Season', value: `${season}`, inline: true },
            )
            .setImage(preview)
            .setFooter('Feeding your gambling addiction ™'));
    },
};
