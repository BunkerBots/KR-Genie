import { MessageEmbed } from 'discord.js';
import Skins from '../../modules/skins.js';
import { emotes, staff, devs, testers, core } from '../../data/index.js';
import marketDB from '../../modules/db/market.js';
import comma from '../../modules/comma.js';


export default {
    name: 'listings',
    aliases: ['skinlistings', 'listing'],
    cooldown: 10,
    description: 'Get a list of all skin listings globally',
    expectedArgs: 'k/listings',
    execute: async(message, args) => {
        // if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || testers.includes(message.author.id))) return;
        const listing = await marketDB.utils.getListing(1);
        console.log(listing);
        const sortedArr = listing.sort((a, b) => a.price - b.price).reverse();
        let pageNumber, footer;
        /**
         * Creates an embed with skinsarr starting from an index.
         * @param {number} start The index to start from.
         */
        const generateEmbed = start => {
            const current = sortedArr.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('Global Skins Listing')
                .setColor(core.embed)
                .setDescription(`Showing skins ${start + 1}-${start + current.length} out of ${sortedArr.length}`)
                .setFooter(footer);
            current.forEach(g => embed.addField(`${Skins.emoteColorParse(g.rarity)} ${g.name} - ${emotes.kr}${comma(g.price)}`, `Item ID : \`${g.id}\` \nListed by <@${g.userID}>`));
            return embed;
        };
        if (sortedArr.length < 10) {
            footer = '1 out of 1';
            message.channel.send(generateEmbed(0));
            return;
        }

        const page = args.shift();
        if (!page) {
            const lastPage = Math.ceil(sortedArr.length / 10);
            footer = `1 out of ${lastPage}`;
            message.channel.send(generateEmbed(0));
        } else {
            const lastPage = Math.ceil(sortedArr.length / 10);
            footer = `${page} out of ${lastPage}`;
            pageNumber = page - 1;
            const currentindex = parseInt(pageNumber * 10);
            console.log(currentindex);
            if (currentindex > sortedArr.length) return;
            message.channel.send(generateEmbed(currentindex));
        }
    },
};

