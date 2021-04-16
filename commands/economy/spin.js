const skinfetcher = require('../../scripts/skins');
const skins = require('../../data/skins');
const dependencies = require('../../data/dependencies');
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'spin',
    execute: async (message , args) => {
        if (!dependencies.betaTesters.testers.includes(message.author.id)) return message.reply('This command is only available for Beta Testers , contact EJ BEAN#3961 to be a part of beta test!')
        const walletbal = await dependencies.economy.balance(message.author.id)
        if (walletbal < 500) return message.channel.send('you do not have 500kr to do a heroic spin (beta)')
        const randomskin = skins.skindata[Math.floor(Math.random() * skins.skindata.length)];
        const preview = skinfetcher.getPreview(randomskin)
        const rarity = skinfetcher.textColorParse(randomskin.rarity)
        const color = skinfetcher.colorParse(randomskin.rarity)
        console.log(color)
        //message.channel.send(preview)  
        //console.log(preview) 
        message.channel.send(new MessageEmbed()
        .setAuthor(message.author.username , message.author.displayAvatarURL({dynamic: false}))
        .setTitle(`${dependencies.emotes.kr} Heroic Spin`)
        .setColor(`${color}`)
        .setDescription(`You unboxed **${randomskin.name}**! [${await rarity}]`)
        .setImage(preview)
        .setFooter('Feeding your gambling addiction ™'))    
        await dependencies.economy.addKR(message.author.id , -500)

    }
}
