import db from '../../modules/db/economy.js';
import data, { emotes } from '../../data/index.js';
import { MessageEmbed } from 'discord.js';
import { getXP, getLevel } from '../../modules/db/levels.js';
import utils from '../../modules/messageUtils.js';
import items from '../../data/items.js';


export default {
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
        let activeItems = [];
        const { wallet, bank } = await db.utils.balance(user.id),
            netWorth = parseInt(wallet + bank),
            xp = await getXP(user.id),
            level = await getLevel(user.id),
            dupes = new Map();
            // eslint-disable-next-line no-unused-vars
        const badgesArr = await utils.parseBadge(user.id);
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
        let badges;
        let tagged;
        console.log(badgesArr);
        if (badgesArr.includes(emotes.hackertagged)) badges = '', tagged = 'https://media.discordapp.net/attachments/831950107649638410/845749925655347200/hackertagged.png';
        else tagged = '', badges = `${badgesArr.join(' ')}`;

        const embed = new MessageEmbed()
            .setAuthor(`${user.username}`)
            .setTitle(badges)
            .setImage(tagged)
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
