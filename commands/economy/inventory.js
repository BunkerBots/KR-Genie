const skinfetcher = require('../../scripts/skins')
const dependencies = require('../../data');
const { MessageEmbed, Util } = require('discord.js');
module.exports = {
    name: 'inv',
    execute: async (message, args) => {
        let skinsarr = []
        //if (!dependencies.developers.developers.includes(message.author.id)) return;
        if (!args[1]) {
            const data = await dependencies.economy.skinInventory(message.author.id)
            let res = ''
            for (const skins of data) {
                const rarity = skinfetcher.textColorParse(skins.rarity)
                skinsarr.push(`• ${skins.name} | ${await rarity}`)
            }
            message.author.send(`**Your Inventory (beta)**\n${skinsarr.join('\n')}` , {split: true})

            return;
        }
        const target = message.client.users.fetch(args[1].replace(/\D/g, ''));
        try { await target } catch (e) {
            message.channel.send('Unknown user')
            return;
        }
        target.then(async user => {
            const data = await dependencies.economy.skinInventory(user.id)
            for (const skins of data) {
                const rarity = skinfetcher.textColorParse(skins.rarity)
                skinsarr.push(`• ${skins.name} | ${await rarity}`)
            }
            message.author.send(`**${user.username}'s Inventory (beta)**\n${skinsarr.join('\n')}` , {split: true})
        })
    }
}

