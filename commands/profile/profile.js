const db = require('../../modules'),
    data = require('../../data'),
    emotes = data.emotes,
    { MessageEmbed } = require('discord.js'),
    levels = require('../../mongo'),
    utils = require('../../modules/messageUtils'),
    item = require('../../modules/utils');
module.exports = {
    name: 'userinfo',
    aliases: ['profile'],
    cooldown: 10,
    execute: async(message, args) => {
        let user;
        if (!args[0]) user = message.author;
        else user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.channel.send('Unknown user');
        let devEmote, staffEmote, earlySupporter, activeItems;
        const krunkitis = await db.utils.krunkitis(user.id),
            premium = await db.utils.premium(user.id),
            verified = await db.utils.verified(user.id),
            { wallet, bank } = await db.utils.balance(user.id),
            netWorth = parseInt(wallet + bank),
            xp = await levels.getXP(user.id),
            level = await levels.getLevel(user.id),
            padlock = await item.findItem(user.id, 'padlock');
            // eslint-disable-next-line no-unused-vars
        if (data.earlySupporter.includes(user.id)) earlySupporter = data.emotes.earlysupporter;
        // else earlySupporter = '';
        if (data.staff.includes(user.id)) staffEmote = data.emotes.staff;
        else staffEmote = '';
        if (data.devs.includes(user.id)) devEmote = data.emotes.developer;
        else devEmote = '';
        console.log(padlock);
        if (padlock != undefined) activeItems = ':lock: Padlock';
        else activeItems = 'Nothing to see here';
        const embedColor = utils.getEmbedColor(level),
            color = utils.parseEmbedColor(level);
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}`)
            .setTitle(`${krunkitis ? emotes.krunkitis : ''} ${premium ? emotes.premium : ''} ${verified ? emotes.verified : ''} ${staffEmote} ${devEmote}`.replace(/\s/g, ' '))
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
                { name: 'Active Items', value: `${activeItems}` },
            );
        message.channel.send(embed);
    },
};
