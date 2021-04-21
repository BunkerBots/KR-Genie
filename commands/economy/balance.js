const { MessageEmbed } = require('discord.js');
const data = require('../../data/');
module.exports = {
    name: 'bal',
    aliases: ['balance'],
    execute: async(message, args) => {
        let user;
        if (!args[1]) {
            user = message.author;
        } else {
            const target = await message.client.users.fetch(message.getMentions(args[1].replace(/\D/g, ''))).catch(() => {});
            if (!target) return message.reply('No valid User/Mention Found!');
            else user = target;
        }
        const { wallet, bank } = await data.economy.balance(user.id);
        message.reply(  
            new MessageEmbed()
                .setAuthor(`${user.username}'s balance`, user.displayAvatarURL({ dynamic: false }))
                .setDescription(`**Wallet:** ${data.emotes.kr} ${wallet}\n**Bank:** ${data.emotes.kr} ${bank}\n**Net:** ${data.emotes.kr} ${wallet + bank}`)
                .setTimestamp()
                .setFooter('stonks')
            );
    },
};
