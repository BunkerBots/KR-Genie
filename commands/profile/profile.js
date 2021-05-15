import db from '../../modules';
import data, { emotes } from '../../data';
import { MessageEmbed } from 'discord.js';
import levels from '../../mongo';
import utils from '../../modules/messageUtils';
import items from '../../data/items';


module.exports = {
    name: 'profile',
    aliases: ['userinfo', 'p'],
    cooldown: 10,
    description: 'Shows an user\'s profile with information like badges, economy status, levels etc',
    expectedArgs: 'k/profile [ID / @user]',
    execute: async(message, args) => {
        let user;
        if (!args[0]) user = message.author;
        else user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.channel.send(utils.createEmbed(message.author, 'RED', 'Unknown user'));
        // eslint-disable-next-line prefer-const
        let devEmote, staffEmote, kpd, earlySupporter, activeItems = [];
        const krunkitis = await db.utils.krunkitis(user.id),
            premium = await db.utils.premium(user.id),
            verified = await db.utils.verified(user.id),
            { wallet, bank } = await db.utils.balance(user.id),
            netWorth = parseInt(wallet + bank),
            xp = await levels.getXP(user.id),
            level = await levels.getLevel(user.id),
            dupes = new Map();
            // eslint-disable-next-line no-unused-vars
        if (data.earlySupporter.includes(user.id)) earlySupporter = data.emotes.earlysupporter;
        // else earlySupporter = '';
        if (data.staff.includes(user.id)) staffEmote = data.emotes.staff;
        else staffEmote = '';
        if (data.devs.includes(user.id)) devEmote = data.emotes.developer;
        else devEmote = '';
        if (data.kpd.includes(user.id)) kpd = data.emotes.kpd;
        else kpd = '';
        const embedColor = utils.getEmbedColor(level),
            color = utils.parseEmbedColor(level);
        const userItems = (await db.utils.itemInventory(user.id)).map(x => items.items[x])
            .filter(x => {
                const count = dupes.get(x.id) || 0;
                dupes.set(x.id, count + 1);
                return !count;
            });
        for (const item of userItems) {
            const count = dupes.get(item.id);
            activeItems.push(`${item.icon} ${item.name}${count == 1 ? '' : ` x ${count}`}`);
        }
        const embed = new MessageEmbed()
            .setAuthor(`${user.username}`)
            .setTitle(`${krunkitis ? emotes.krunkitis : ''} ${premium ? emotes.premium : ''} ${verified ? emotes.verified : ''} ${kpd} ${staffEmote} ${devEmote}`.replace(/\s/g, ' '))
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
                { name: 'Active Items', value: `${activeItems.join('\n') || 'Nothing to see here'}` },
            );
        message.channel.send(embed);
    },
};
