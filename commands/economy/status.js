const { MessageEmbed } = require('discord.js');
const data = require('../../data');
module.exports = {
    name: 'status',
    aliases: ['stats', 'stat'],
    execute: async(message, args) => {
        const sortedRarities = [];
        const Inventory = await data.economy.skinInventory(message.author.id);
        if (!args[1]) {
            for (let i = 0; i < 7; i++)
                sortedRarities[i] = Inventory.filter(x => x.rarity == i);
            message.channel.send(new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle(`${message.author.username}'s Economy Stats`)
                .setDescription(`Total spins : ${Inventory.length}`)
                .addField(`${data.emotes.unobtainable} Unobtainables:`, `${sortedRarities[6].length || 0}`)
                .addField(`${data.emotes.contraband} Contrabands:`, `${sortedRarities[5].length || 0}`)
                .addField(`${data.emotes.relic} Relics:`, `${sortedRarities[4].length || 0}`)
                .addField(`${data.emotes.legendary} Legendaries`, `${sortedRarities[3].length || 0}`)
                .addField(`${data.emotes.epic} Epics:`, `${sortedRarities[2].length || 0}`)
                .addField(`${data.emotes.rare} Rares:`, `${sortedRarities[1].length || 0}`),
            );
            return;
        }

        const target = message.client.users.fetch(args[1].replace(/\D/g, ''));
        try {
            await target;
        } catch (e) {
            message.channel.send('Unknown user');
        }
        target.then(async user => {
            const userInventory = await data.economy.skinInventory(user.id);
            for (let i = 0; i < 7; i++)
                sortedRarities[i] = userInventory.filter(x => x.rarity == i);
            message.channel.send(new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle(`${user.username}'s Economy Stats`)
                .setDescription(`Total spins : ${userInventory.length}`)
                .addField('Unobtainables:', `${sortedRarities[6].length || 0}`)
                .addField('Contrabands:', `${sortedRarities[5].length || 0}`)
                .addField('Relics:', `${sortedRarities[4].length || 0}`)
                .addField('Legendaries', `${sortedRarities[3].length || 0}`)
                .addField('Epics:', `${sortedRarities[2].length || 0}`)
                .addField('Rares:', `${sortedRarities[1].length || 0}`),
            );
        });
    },
};
