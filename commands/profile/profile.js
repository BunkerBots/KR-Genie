const db = require('../../modules'),
    data = require('../../data'),
    emotes = data.emotes,
    { MessageEmbed } = require('discord.js'),
    levels = require('../../mongo'),
    utils = require('../../modules/messageUtils');
module.exports = {
    name: 'userinfo',
    aliases: ['profile'],
    cooldown: 10, // ms
    execute: async(message, args) => {
        if (!args[0]) {
            let devEmote, staffEmote, earlySupporter;
            const krunkitis = await db.utils.krunkitis(message.author.id),
                premium = await db.utils.premium(message.author.id),
                verified = await db.utils.verified(message.author.id),
                { wallet, bank } = await db.utils.balance(message.author.id),
                netWorth = parseInt(wallet + bank),
                xp = await levels.getXP(message.author.id),
                level = await levels.getLevel(message.author.id);
            // eslint-disable-next-line no-unused-vars
            if (data.earlySupporter.includes(message.author.id)) earlySupporter = data.emotes.earlysupporter;
            // else earlySupporter = '';
            if (data.staff.includes(message.author.id)) staffEmote = data.emotes.staff;
            else staffEmote = '';
            if (data.devs.includes(message.author.id)) devEmote = data.emotes.developer;
            else devEmote = '';
            const embedColor = utils.getEmbedColor(level),
                color = utils.parseEmbedColor(level);
            const embed = new MessageEmbed()
                .setAuthor(`${message.author.username}`)
                .setTitle(`${krunkitis ? emotes.krunkitis : ''} ${premium ? emotes.premium : ''} ${verified ? emotes.verified : ''} ${staffEmote} ${devEmote}`.replace(/\s/g, ''))
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setColor(`${await embedColor}`)
                // .setDescription('*biography coming soon™*')
                .addFields(
                    { name: 'Level', value: `\`${level}\``, inline: true },
                    { name: 'xp', value: `\`${xp[0]}/${xp[1]}\``, inline: true },
                    { name: 'Level color', value: `${await color}`, inline: true },
                    { name: 'Wallet', value: `\`${wallet}\``, inline: true },
                    { name: 'Bank', value: `\`${bank}\``, inline: true },
                    { name: 'Net worth', value: `\`${netWorth}\``, inline: true },
                );
            message.channel.send(embed);
            return;
        }


        const user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.channel.send('Unknown user');
        let devEmote, staffEmote, earlySupporter;
        const krunkitis = await db.utils.krunkitis(user.id),
            premium = await db.utils.premium(user.id),
            verified = await db.utils.verified(user.id),
            { wallet, bank } = await db.utils.balance(user.id),
            netWorth = parseInt(wallet + bank),
            xp = await levels.getXP(user.id),
            level = await levels.getLevel(user.id);
        // eslint-disable-next-line no-unused-vars
        if (data.earlySupporter.includes(user.id)) earlySupporter = data.emotes.earlysupporter;
        // else earlySupporter = '';
        if (data.staff.includes(user.id)) staffEmote = data.emotes.staff;
        else staffEmote = '';
        if (data.devs.includes(user.id)) devEmote = data.emotes.developer;
        else devEmote = '';
        const embedColor = utils.getEmbedColor(level),
            color = utils.parseEmbedColor(level);
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}`)
            .setTitle(`${krunkitis ? emotes.krunkitis : ''} ${premium ? emotes.premium : ''} ${verified ? emotes.verified : ''} ${staffEmote} ${devEmote}`.replace(/\s/g, ''))
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(`${await embedColor}`)
            // .setDescription('*biography coming soon™*')
            .addFields(
                { name: 'Level', value: `\`${level}\``, inline: true },
                { name: 'xp', value: `\`${xp[0]}/${xp[1]}\``, inline: true },
                { name: 'Level color', value: `${await color}`, inline: true },
                { name: 'Wallet', value: `\`${wallet}\``, inline: true },
                { name: 'Bank', value: `\`${bank}\``, inline: true },
                { name: 'Net worth', value: `\`${netWorth}\``, inline: true },
            );
        message.channel.send(embed);
    },
};
