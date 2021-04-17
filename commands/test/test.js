const { MessageEmbed, Message } = require('discord.js')
const dependencies = require('../../data')
const skinfetcher = require('../../data/skins')
module.exports = {
    name: 'test',
    aliases: ['lb'],
    execute: async (m, a) => {
        let arr = new Array()
        try{
        await m.guild.members.cache.forEach(async member => {
            const wallet = await dependencies.economy.balance(member.id)
            if (wallet <= 0) return;
            await arr.push(wallet)
            console.log(wallet)
        })
    } finally {
        console.log(arr)
    }

    }
}
