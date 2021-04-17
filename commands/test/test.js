const { MessageEmbed, Message } = require('discord.js')
const dependencies = require('../../data')
const skinfetcher = require('../../data/skins')
module.exports = {
    name: 'test',
    aliases: ['lb'],
    execute: async (m, a) => {
        let arr = [];
        m.guild.members.cache.forEach(async member => {
            const wallet = await dependencies.economy.balance(member.id)
            arr.push(wallet)
            console.log(wallet)
        }).then(() => {
        console.log(arr)
        })
    }
}
