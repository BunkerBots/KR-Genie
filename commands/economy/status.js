const { MessageEmbed } = require('discord.js')
const data = require('../../data');
module.exports = {
    name: 'status',
    aliases: ['stats', 'stat'],
    execute: async (message, args) => {
        let sortedRarities = [];
        const Inventory = await data.economy.skinInventory(message.author.id)
        if (!args[1]) {
            for (let i = 0; i < 7; i++)
                sortedRarities[i] = Inventory.filter(x => x.rarity == i);
            message.channel.send(new MessageEmbed()
            .setAuthor(message.author.username , message.author.displayAvatarURL({dynamic: false}))
            .setTitle(`${message.author.username}'s Economy Stats`)
            .setDescription(`Total spins : ${Inventory.length}`)
            .addField(`Unobtainables:`, `${sortedRarities[6].length || 0}`)
            .addField(`Contrabands:` , `${sortedRarities[5].length || 0}`)
            .addField(`Relics:`, `${sortedRarities[4].length || 0}`)
            .addField(`Legendaries` , `${sortedRarities[3].length || 0}`)
            .addField(`Epics:` , `${sortedRarities[2].length || 0}`)
            .addField(`Rares:` , `${sortedRarities[1].length || 0}`)
            )
        }
    }
}