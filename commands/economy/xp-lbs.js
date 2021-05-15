import schema from '../../mongo/schema.js';
import mongo from '../../mongo/mongo/index.js';
import { MessageEmbed } from 'discord.js';


export default {
    name: 'xp',
    aliases: ['xplbs', 'lbsxp', 'levels'],
    cooldown: 5,
    description: 'Shows the global ranking of users based on levels and XP',
    expectedArgs: 'k/xp',
    execute: async(message, args) => {
        const levelsLb = [new Object()];
        await mongo().then(async() => {
            const res = await schema.find().lean();
            for (const i of [...res])
                levelsLb.push({ id: `<@${i.userId}>`, level: i.level, xp: i.xp });
        });
        const sortedArrxp = levelsLb.sort((a, b) => a.xp - b.xp).reverse();
        const sortedArr = sortedArrxp.sort((a, b) => b.level - a.level);
        console.log(sortedArr);
        let footer, pageNumber;
        /**
         * Creates an embed with skinsarr starting from an index.
         * @param {number} start The index to start from.
         */
        const generateEmbed = start => {
            const current = sortedArr.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('Global Levels Leaderboard')
                .setDescription(`Showing users ${start + 1}-${start + current.length} out of ${sortedArr.length}`)
                .setFooter(footer);
            current.forEach(g => embed.addField('\u200b', `\`${++start}.\` ${g.id} • Level \`${g.level}\` • XP \`${g.xp}\``));
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
