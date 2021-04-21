const skinfetcher = require('../../scripts/skins')
const dependencies = require('../../data');
const { MessageEmbed, Util } = require('discord.js');
module.exports = {
    name: 'inv',
    execute: async (message, args) => {
        let skinsarr = []
        //if (!dependencies.developers.developers.includes(message.author.id)) return;
        if (!args[1] || (Number.isInteger(parseInt(args[1])) && args[1].length < 5)) {
            let footer;
            let pageNumber;
            const data = await dependencies.economy.skinInventory(message.author.id)
            let res = ''
            for (const skins of data) {
                const rarity = skinfetcher.emoteColorParse(skins.rarity)
                let weap;
                if (skins.class) weap = skins.class
                else weap = ''
                const type = skinfetcher.getWeaponByID(weap)
                skinsarr.push(`${await rarity} ${skins.name} ${await type}`)
            }
            let i;
            if (!skinsarr.length) i = 'No data found'
            else i = skinsarr.join('\n')
            const guilds = skinsarr

            /**
             * Creates an embed with guilds starting from an index.
             * @param {number} start The index to start from.
             */
            const generateEmbed = start => {
                const current = guilds.slice(start, start + 10)
                const embed = new MessageEmbed()
                    .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                    .setTitle(`${message.author.username}'s Inventory`)
                    .setDescription(`Showing skins ${start + 1}-${start + current.length} out of ${guilds.length}`)
                    .setFooter(footer)
                current.forEach(g => embed.addField(g, '\u200b'))
                return embed
            }
            if (guilds.length < 10) {
                footer = `1 out of 1`
                message.channel.send(generateEmbed(0))
                return;
            }

            if (!args[1]) {
                let lastPage = guilds.length / 10
                if (!Number.isInteger(lastPage)) lastPage = parseInt(lastPage.toFixed(0)) + 1
                footer = `1 out of ${lastPage}`
                message.channel.send(generateEmbed(0))
            } else {
                let lastPage = guilds.length / 10
                if (!Number.isInteger(lastPage)) lastPage = parseInt(lastPage.toFixed(0)) + 1
                footer = `${args[1]} out of ${lastPage}`
                pageNumber = args[1] - 1
                let currentindex = parseInt(pageNumber * 10)
                console.log(currentindex)
                if (currentindex > guilds.length) return;
                message.channel.send(generateEmbed(currentindex))
            }

            return;
        }
        const target = message.client.users.fetch(args[1].replace(/\D/g, ''));
        try { await target } catch (e) {
            message.channel.send('Unknown user')
            return;
        }
        console.log(target)
        target.then(async user => {
            let footer;
            let pageNumber;
            const data = await dependencies.economy.skinInventory(user.id)
            for (const skins of data) {
                const rarity = skinfetcher.emoteColorParse(skins.rarity)
                let weap;
                if (skins.class) weap = skins.class
                else weap = ''
                const type = skinfetcher.getWeaponByID(weap)
                skinsarr.push(`${await rarity} ${skins.name} ${await type}`)
            }
            let i;
            if (!skinsarr.length) i = 'No data found'
            else i = skinsarr.join('\n')
            const guilds = skinsarr

            /**
             * Creates an embed with guilds starting from an index.
             * @param {number} start The index to start from.
             */
            const generateEmbed = start => {
                const current = guilds.slice(start, start + 10)
                const embed = new MessageEmbed()
                    .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                    .setTitle(`${user.username}'s Inventory`)
                    .setDescription(`Showing skins ${start + 1}-${start + current.length} out of ${guilds.length}`)
                    .setFooter(footer)
                current.forEach(g => embed.addField(g, '\u200b'))
                return embed
            }
            if (guilds.length < 10) {
                footer = `1 out of 1`
                message.channel.send(generateEmbed(0))
                return;
            }

            if (!args[2]) {
                let lastPage = guilds.length / 10
                if (!Number.isInteger(lastPage)) lastPage = parseInt(lastPage.toFixed(0)) + 1
                footer = `1 out of ${lastPage}`
                message.channel.send(generateEmbed(0))
            } else {
                let lastPage = guilds.length / 10
                if (!Number.isInteger(lastPage)) lastPage = parseInt(lastPage.toFixed(0)) + 1
                footer = `${args[2]} out of ${lastPage}`
                pageNumber = args[2] - 1
                let currentindex = pageNumber * 10
                if (currentindex > guilds.length) return;
                message.channel.send(generateEmbed(currentindex))
            }
        })

    }
}