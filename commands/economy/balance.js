const { MessageEmbed } = require('discord.js'),
    data = require('../../data/'),
    db = require('../../modules'),
    comma = require('../../modules/comma'),
    utils = require('../../modules/messageUtils');

module.exports = {
    name: 'balance',
    aliases: ['bal', 'kr'],
    cooldown: 2,
    description: `Check your ${data.emotes.kr} balance, or someone else's. Displays wallet, bank and net worth.`,
    expectedArgs: 'k/balance [ID / @user]',
    execute: async(message, args) => {
        let user;
        if (!args[0])
            user = message.author;
        else
            user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});

        if (!user)
            return message.channel.send(await utils.createEmbed(message.author, 'RED', 'Unknown user'));
        const color = await utils.color(user);

        const { wallet, bank } = await db.utils.balance(user.id);
        message.reply(new MessageEmbed()
            .setAuthor(`${user.username}'s balance`, user.displayAvatarURL({ dynamic: false }))
            .setDescription(`**Wallet:** ${data.emotes.kr} ${comma(wallet)}\n**Bank:** ${data.emotes.kr} ${comma(bank)}\n**Net:** ${data.emotes.kr} ${comma(wallet + bank)}`)
            .setTimestamp()
            .setColor(`${await color}`)
            .setFooter('stonks'));
    },
};
