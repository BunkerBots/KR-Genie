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
                res += `\n[${skins.name}](${skins.link}) x ${skins.count}`
                const rarity = skinfetcher.textColorParse(skins.rarity)
                skinsarr.push(`• ${skins.name} | ${await rarity}`)
            }
            const [first, ...rest] = Util.splitMessage(skinsarr.join('\n'), { maxLength: 2048 })
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}'s Inventory`, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription(first)
                .setTitle(`Skin count - ${data.length}`)
            if (!rest.length) {
                return message.author.send(embed).catch(err => message.reply('Please open your DM\'s and try again later'))
            }
            for (const text of rest) {
                embed.setDescription(text)
                console.log(text)
                console.log(skinsarr.join('\n'))
                await message.author.send(embed).catch(err => message.reply('Please open your DM\'s and try again later'))
            }

            return;
        }
        const target = message.client.users.fetch(args[1].replace(/\D/g, ''));
        try { await target } catch (e) {
            message.channel.send('Unknown user')
            return;
        }
        target.then(async user => {
            const data = await dependencies.economy.skinInventory(user.id)
            let res = ''
            for (const skins of data) {
                res += `\n[${skins.name}](${skins.link}) x ${skins.count}`
                const rarity = skinfetcher.textColorParse(skins.rarity)
                skinsarr.push(`• ${skins.name} | ${await rarity}`)
                const [first, ...rest] = Util.splitMessage(skinsarr.join('\n'), { maxLength: 2048 })
                const embed = new MessageEmbed()
                    .setAuthor(`${user.username}'s Inventory`, user.displayAvatarURL({ dynamic: false }))
                    .setDescription(first)
                    .setTitle(`Skin count - ${data.length}`)
                if (!rest.length) {
                    return message.author.send(embed).catch(err => message.reply('Please open your DM\'s and try again later'))
                }
                for (const text of rest) {
                    embed.setDescription(text)
                    console.log(text)
                    console.log(skinsarr.join('\n'))
                    await message.author.send(embed).catch(err => message.reply('Please open your DM\'s and try again later'))
                }
                return;
            }
        })
    }
}

