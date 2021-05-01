/* eslint-disable no-unused-vars */
const utils = require('../../modules/messageUtils'),
    mongo = require('../../mongo/mongo'),
    schema = require('../../mongo/schema'),
    { MessageEmbed } = require('discord.js'),
    core = require('../../data').core;
module.exports = {
    name: 'xp',
    aliases: ['xplbs', 'lb-xp', 'experience'],
    dev: true,
    execute: async(message, args) => {
        const arr = [];
        // console.log(i);
        await mongo().then(async() => {
            const x = await schema.find();
            const data = x.sort((a, b) => a.level - b.level).reverse();
            for (const i of data) {
                const user = await utils.getID(i.userId);
                arr.push({ name: user.username, xp: i.xp, level: i.level });
            }
            console.log(arr);
            let pageNumber;
            let footer;
            /**
            * Creates an embed with skinsarr starting from an index.
            * @param {number} start The index to start from.
            */
            const generateEmbed = start => {
                const current = arr.slice(start, start + 10);
                const embed = new MessageEmbed()
                    .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle('Global XP leaderboard')
                    .setColor(core.embed)
                    .setDescription(`Showing users ${start + 1}-${start + current.length} out of ${arr.length}`)
                    .setFooter(footer);
                current.forEach(g => embed.addField('\u200b', `\`${++start}.\` **${g.name}** - \`Level ${g.level}\` - \`${g.xp}xp\``));
                return embed;
            };
            if (arr.length < 10) {
                footer = '1 out of 1';
                message.channel.send(generateEmbed(0));
                return;
            }

            const page = args.shift();
            if (!page) {
                const lastPage = Math.ceil(arr.length / 10);
                footer = `1 out of ${lastPage}`;
                message.channel.send(generateEmbed(0));
            } else {
                const lastPage = Math.ceil(arr.length / 10);
                footer = `${page} out of ${lastPage}`;
                pageNumber = page - 1;
                const currentindex = parseInt(pageNumber * 10);
                console.log(currentindex);
                if (currentindex > arr.length) return;
                message.channel.send(generateEmbed(currentindex));
            }
        });
    },
};
