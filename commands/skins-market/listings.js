const { MessageEmbed } = require('discord.js'),
    Skins = require('../../modules/skins'),
    { emotes, staff, devs, testers } = require('../../data'),
    // { createEmbed, parse } = require('../../modules/messageUtils'),
    marketDB = require('../../mongo/market/market');
module.exports = {
    name: 'listings',
    aliases: [],
    cooldown: 20,
    description: 'Own way too many skins? Use this command to sell some of them',
    expectedArgs: 'k/sell (skin name)',
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id) || testers.includes(message.author.id))) return;
        const listing = await marketDB.utils.getListing(1);
        console.log(listing);
        const sortedArr = listing.sort((a, b) => a.price - b.price).reverse();
        // message.reply(new MessageEmbed()
        //     .setTitle('Skin listings')
        //     .setColor('GREEN')
        //     .setDescription(`${listing.join('\n')}`)
        //     .setFooter('stonks4u'),
        // );
        let pageNumber, footer;
        /**
         * Creates an embed with skinsarr starting from an index.
         * @param {number} start The index to start from.
         */
        const generateEmbed = start => {
            const current = sortedArr.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('Global Skins listing')
                .setDescription(`Showing skins ${start + 1}-${start + current.length} out of ${sortedArr.length}`)
                .setFooter(footer);
            current.forEach(g => embed.addField(`${g.name} - ${emotes.kr}${g.price}`, `${Skins.emoteColorParse(g.rarity)} Listed by <@${g.userID}>`));
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

