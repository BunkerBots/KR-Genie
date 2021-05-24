import Skins from '../../modules/skins.js';
import db from '../../modules/db/economy.js';
import { createEmbed } from '../../modules/messageUtils.js';
import { MessageEmbed } from 'discord.js';


export default {
    name: 'skins',
    aliases: ['skinsinv'],
    cooldown: 5,
    description: 'Shows the list of skins owned by an user',
    expectedArgs: 'k/skins [ID / @user]',
    execute: async(message, args) => {
        const skinsarr = [];
        let user;
        if (!args[0] || (Number.isInteger(parseInt(args[0])) && args[0].length < 5))
            user = message.author;
        else {
            const target = await message.client.users.fetch(args.shift().replace(/\D/g, '')).catch(() => {});
            if (!target) return message.reply(createEmbed(message.author, 'RED', 'No user found!'));
            else user = target;
        }
        let footer;
        let pageNumber;
        const dupes = new Map();
        const data = (await db.utils.skinInventory(user.id)).map(x => Skins.allSkins[x]).sort((a, b) => a.rarity - b.rarity).reverse()
            .filter(x => {
                const count = dupes.get(x.index) || 0;
                dupes.set(x.index, count + 1);
                return !count;
            });
        for (const skin of data) {
            const link = Skins.getMarketLink(skin);
            const count = dupes.get(skin.index);
            skinsarr.push(`${Skins.emoteColorParse(skin.rarity)} [${skin.name}](${await link})${count == 1 ? '' : ` x ${count}`}`);
        }
        /**
         * Creates an embed with skinsarr starting from an index.
         * @param {number} start The index to start from.
         */
        const generateEmbed = start => {
            const current = skinsarr.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`${user.username}'s Skins`)
                .setDescription(`Showing skins ${start + 1}-${start + current.length} out of ${skinsarr.length}`)
                .setFooter(footer);
            current.forEach(g => embed.addField('\u200b', g));
            return embed;
        };
        if (skinsarr.length < 10) {
            footer = '1 out of 1';
            message.channel.send(generateEmbed(0));
            return;
        }

        const page = args.shift();
        if (!page) {
            const lastPage = Math.ceil(skinsarr.length / 10);
            footer = `1 out of ${lastPage}`;
            message.channel.send(generateEmbed(0));
        } else {
            const lastPage = Math.ceil(skinsarr.length / 10);
            footer = `${page} out of ${lastPage}`;
            pageNumber = page - 1;
            const currentindex = parseInt(pageNumber * 10);
            console.log(currentindex);
            if (currentindex > skinsarr.length) return;
            message.channel.send(generateEmbed(currentindex));
        }
    },
};

