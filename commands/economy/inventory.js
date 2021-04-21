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

                // you can of course customise this embed however you want
                const embed = new MessageEmbed()
                    .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                    .setTitle('Your Inventory')
                    .setDescription(`Showing skins ${start + 1}-${start + current.length} out of ${guilds.length}`)
                current.forEach(g => embed.addField(g, '\u200b'))
                return embed
            }

            // edit: you can store the message author like this:
            const author = message.author

            // send the embed with the first 10 guilds
            message.channel.send(generateEmbed(0)).then(message => {
                // exit if there is only one page of guilds (no need for all of this)
                if (guilds.length <= 10) return
                // react with the right arrow (so that the user can click it) (left arrow isn't needed because it is the start)
                message.react('➡️')
                const collector = message.createReactionCollector(
                    // only collect left and right arrow reactions from the message author
                    (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id,
                    // time out after a minute
                    { time: 60000 }
                )

                let currentIndex = 0
                collector.on('collect', reaction => {
                    // remove the existing reactions
                    message.reactions.removeAll().then(async () => {
                        // increase/decrease index
                        reaction.emoji.name === '⬅️' ? currentIndex -= 10 : currentIndex += 10
                        // edit message with new embed
                        message.edit(generateEmbed(currentIndex))
                        // react with left arrow if it isn't the start (await is used so that the right arrow always goes after the left)
                        if (currentIndex !== 0) await message.react('⬅️')
                        // react with right arrow if it isn't the end
                        if (currentIndex + 10 < guilds.length) message.react('➡️')
                    })
                })
            })

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

            if (!args[2]){
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