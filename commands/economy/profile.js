const db = require('../../modules');
const data = require('../../data');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'userinfo',
    aliases: ['profile'],
    cooldown: 10,
    execute: async(message, args) => {
        if (!args[0]) {
            let krunkitisEmote,
                premiumEmote,
                verifiedEmote,
                devEmote,
                staffEmote,
                earlySupporter;
            const krunkitis = await db.utils.krunkitis(message.author.id);
            const premium = await db.utils.premium(message.author.id);
            const verified = await db.utils.verified(message.author.id);
            const { wallet, bank } = await db.utils.balance(message.author.id);
            const netWorth = parseInt(wallet + bank);
            if (data.earlySupporter.includes(message.author.id)) earlySupporter = data.emotes.earlysupporter;
            else earlySupporter = '';
            if (data.staff.includes(message.author.id)) staffEmote = data.emotes.staff;
            else staffEmote = '';
            if (data.devs.includes(message.author.id)) devEmote = data.emotes.developer;
            else devEmote = '';
            if (krunkitis == true) krunkitisEmote = data.emotes.krunkitis;
            else krunkitisEmote = '';
            if (premium == true) premiumEmote = data.emotes.premium;
            else premiumEmote = '';
            if (verified == true) verifiedEmote = data.emotes.verified;
            else verifiedEmote = '';
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}`)
                .setTitle(`${krunkitisEmote} ${premiumEmote} ${verifiedEmote} ${staffEmote} ${devEmote}`)
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setDescription('*biography coming soon™*')
                .addFields(
                    { name: 'Economy stats', value: '\u200b' },
                    { name: 'Wallet', value: `\`${parseInt(wallet)}\``, inline: true },
                    { name: 'Bank', value: `\`${parseInt(bank)}\``, inline: true },
                    { name: 'Net worth', value: `\`${netWorth}\``, inline: true },
                );
            message.channel.send(embed);
            return;
        }


        const user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.channel.send('Unknown user');
        let krunkitisEmote,
            premiumEmote,
            verifiedEmote,
            devEmote,
            staffEmote,
            earlySupporter;
        const krunkitis = await db.utils.krunkitis(user.id);
        const premium = await db.utils.premium(user.id);
        const verified = await db.utils.verified(user.id);
        const { wallet, bank } = await db.utils.balance(user.id);
        const netWorth = parseInt(wallet + bank);
        if (data.earlySupporter.includes(user.id)) earlySupporter = data.emotes.earlysupporter;
        else earlySupporter = '';
        if (data.staff.includes(user.id)) staffEmote = data.emotes.staff;
        else staffEmote = '';
        if (data.devs.includes(user.id)) devEmote = data.emotes.developer;
        else devEmote = '';
        if (krunkitis == true) krunkitisEmote = data.emotes.krunkitis;
        else krunkitisEmote = '';
        if (premium == true) premiumEmote = data.emotes.premium;
        else premiumEmote = '';
        if (verified == true) verifiedEmote = data.emotes.verified;
        else verifiedEmote = '';
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}`)
            .setTitle(`${krunkitisEmote} ${premiumEmote} ${verifiedEmote} ${staffEmote} ${devEmote}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setDescription('*biography coming soon™*')
            .addFields(
                { name: 'Economy stats', value: '\u200b' },
                { name: 'Wallet', value: `\`${parseInt(wallet)}\``, inline: true },
                { name: 'Bank', value: `\`${parseInt(bank)}\``, inline: true },
                { name: 'Net worth', value: `\`${netWorth}\``, inline: true },
            );
        message.channel.send(embed);
    },
};
