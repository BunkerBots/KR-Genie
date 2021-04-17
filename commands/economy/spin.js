const skinfetcher = require('../../scripts/skins');
const skins = require('../../data/skins');
const dependencies = require('../../data');
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'spin',
    cooldown: 10,
    execute: async (message, args) => {
        //if (!dependencies.betaTesters.testers.includes(message.author.id)) return message.reply('This command is only available for Beta Testers , contact EJ BEAN#3961 to be a part of beta test!')
        const walletbal = await dependencies.economy.balance(message.author.id)
        if (walletbal < 500) return message.channel.send('you do not have 500kr to do a heroic spin (beta)')
        const randomskin = skins.skindata[Math.floor(Math.random() * skins.skindata.length)];
        const preview = skinfetcher.getPreview(randomskin)
        const rarity = skinfetcher.textColorParse(randomskin.rarity)
        const color = skinfetcher.colorParse(randomskin.rarity)
        console.log(color)
        let season;
        if (randomskin.seas) season = randomskin.seas
        else season = '1'
        let creator;
        if (randomskin.creator) creator = randomskin.creator
        else creator = 'krunker.io'
        const inv = await dependencies.economy.skinInventory(message.author.id)
        let skincount = 1
        /*for (const skins of inv) {
            if (skins.name == randomskin.name) {
                message.channel.send(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                    .setTitle(`${dependencies.emotes.kr} Heroic Spin`)
                    .setColor(`${color}`)
                    .setDescription(`You unboxed **${randomskin.name}**!`)
                    .addFields(
                        { name: 'Rarity', value: `${await rarity}`, inline: true },
                        { name: 'Creator', value: `${creator}`, inline: true },
                        { name: `Season`, value: `${season}`, inline: true },
                    )
                    .setImage(preview)
                    .setFooter('Feeding your gambling addiction ™'))
                    return;
            }
        }*/
        let skininfo = { name: randomskin.name.toLowerCase(), id: randomskin.id, rarity: randomskin.rarity, color: color, link: preview, seas: season }
        message.channel.send(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
            .setTitle(`${dependencies.emotes.kr} Heroic Spin`)
            .setColor(`${color}`)
            .setDescription(`You unboxed **${randomskin.name}**!`)
            .addFields(
                { name: 'Rarity', value: `${await rarity}`, inline: true },
                { name: 'Creator', value: `${creator}`, inline: true },
                { name: `Season`, value: `${season}`, inline: true },
            )
            .setImage(preview)
            .setFooter('Feeding your gambling addiction ™'))
        await dependencies.economy.addKR(message.author.id, -500)
        await dependencies.economy.addSkin(message.author.id, skininfo)

    }
}
