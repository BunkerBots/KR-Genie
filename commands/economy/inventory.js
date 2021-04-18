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
                let weap;
                if (skins.class) weap = skins.class
                else weap = ''
                const type = skinfetcher.getWeaponByID(weap)
                skinsarr.push(`• ${skins.name} [ ${await rarity} ] ${await type}`)
            }
            let i;
            if (!skinsarr.length) i = 'No data found'
            else i = skinsarr.join('\n')
            try{
            await message.author.send(`**Your Inventory (beta)**\n\`\`\`ini\n${i}\`\`\``, { split: true })
            } catch (e) {
                message.reply('Please open your DM\s and try again later')
                return;
            }
            message.channel.send(new MessageEmbed()
            .setTitle(`:mailbox: You have recieved a mail`))

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
                let weap;
                if (skins.class) weap = skins.class
                else weap = ''
                const type = skinfetcher.getWeaponByID(weap)
                skinsarr.push(`• ${skins.name} [ ${await rarity} ] ${await type}`)
            }
            let i;
            if (!skinsarr.length) i = 'No data found'
            else i = skinsarr.join('\n')
            try{
                await message.author.send(`**${user.username}'s Inventory (beta)**\n\`\`\`ini\n${i}\`\`\``, { split: true })
                } catch (e) {
                    message.reply('Please open your DM\s and try again later')
                    return;
                }
                message.channel.send(new MessageEmbed()
                .setTitle(`:mailbox: You have recieved a mail`))
        })
    }
}

