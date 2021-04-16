const dependencies = require('../../data');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'inv',
    execute: async (message, args) => {
        //if (!dependencies.developers.developers.includes(message.author.id)) return;
        if (!args[1]) {
            const data = await dependencies.economy.skinInventory(message.author.id)
            let res = ''
            for (const skins of data) {
                res += `\n[${skins.name}](${skins.link}) x ${skins.count}`
            }
            console.log(data)
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}'s Inventory`, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription('Skin listing cooming soon™')
                .setTitle(`Skin count - ${data.length}`)
            message.channel.send(embed)
            return;
        }
        const target = message.client.users.fetch(args[1].replace(/\D/g, ''));
        try { await target } catch (e) { 
            message.channel.send('Unknown user')
            return;
        }
        target.then (async user => {
            const data = await dependencies.economy.skinInventory(user.id)
            let res = ''
            for (const skins of data) {
                res += `\n[${skins.name}](${skins.link}) x ${skins.count}`
            
            const embed = new MessageEmbed()
                .setAuthor(`${user.username}'s Inventory`, user.displayAvatarURL({ dynamic: false }))
                .setDescription('Skin listing cooming soon™')
                .setTitle(`Skin count - ${data.length}`)
            message.channel.send(embed)
            return;
            }
        })   
    }
}

