const { MessageEmbed } = require('discord.js'),
    emotes = require('../../data').emotes,
    items = require('../../data/items'),
    comma = require('../../modules/comma');
module.exports = {
    name: 'shop',
    aliases: ['market'],
    execute: async(message, args) => {
        /* const embed = new MessageEmbed()
            .setAuthor('KR Market')
            .setDescription(`A place to blow your ${emotes.kr} and get cool items`)
            .addFields(
                { name: `Shop Items\n\u200b\n${market.items.premium.icon} ${market.items.premium.name} : ${emotes.kr}${market.items.premium.displayprice}`, value: `${market.items.premium.description}\n\u200b` },
                { name: `${market.items['face-mask'].icon} ${market.items['face-mask'].name} : ${emotes.kr}${market.items['face-mask'].displayprice}`, value: `${market.items['face-mask'].description}\n\u200b` },
                { name: `${market.items.antidote.icon} ${market.items.antidote.name} : ${emotes.kr}${market.items.antidote.displayprice}`, value: `${market.items.antidote.description}\n\u200b` },
                { name: `${market.items.asokra.icon} ${market.items.asokra.name} : ${emotes.kr}${market.items.asokra.displayprice}`, value: `${market.items.asokra.description}\n\u200b` },
                { name: `${market.items.earish.icon} ${market.items.earish.name} : ${emotes.kr}${market.items.earish.displayprice}`, value: `${market.items.earish.description}\n\u200b` },
                { name: `${market.items.slick.icon} ${market.items.slick.name} : ${emotes.kr}${market.items.slick.displayprice}`, value: `${market.items.slick.description}\n\u200b` },
                { name: `${market.items.jytesh.icon} ${market.items.jytesh.name} : ${emotes.kr}${market.items.jytesh.displayprice}`, value: `${market.items.jytesh.description}\n\u200b` },
                { name: `${market.items.disney.icon} ${market.items.disney.name} : ${emotes.kr}${market.items.disney.displayprice}`, value: `${market.items.disney.description}\n\u200b` },
                { name: `${market.items.jon.icon} ${market.items.jon.name} : ${emotes.kr}${market.items.jon.displayprice}`, value: `${market.items.jon.description}\n\u200b` },
            );
        message.channel.send(embed);*/

        let footer;
        let pageNumber;
        /**
         * Creates an embed with items starting from an index.
         * @param {number} start The index to start from.
         */
        const generateEmbed = start => {
            const current = items.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor('KR Market')
                .setDescription(`A place to spend your ${emotes.kr} and get cool items\n\u200b`)
                .setFooter(footer);
            current.forEach(g => embed.addField(`${g.icon} ${g.name} : ${emotes.kr}${comma(g.price)}`, `${g.description}\n\u200b`));
            return embed;
        };
        if (items.length < 10) {
            footer = '1 out of 1';
            message.channel.send(generateEmbed(0));
            return;
        }

        const page = args.shift();
        if (!page) {
            let lastPage = items.length / 10;
            if (!Number.isInteger(lastPage)) lastPage = parseInt(lastPage.toFixed(0)) + 1;
            footer = `1 out of ${lastPage}`;
            message.channel.send(generateEmbed(0));
        } else {
            let lastPage = items.length / 10;
            if (!Number.isInteger(lastPage)) lastPage = parseInt(lastPage.toFixed(0)) + 1;
            footer = `${page} out of ${lastPage}`;
            pageNumber = page - 1;
            const currentindex = parseInt(pageNumber * 10);
            console.log(currentindex);
            if (currentindex > items.length) return;
            message.channel.send(generateEmbed(currentindex));
        }
    },
};
