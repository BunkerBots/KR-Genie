import levels from '../db/levels.js';
import utils from '../messageUtils.js';
// import Paginator from '../../modules/paginate.js';
import Paginator from '../paginator.js';
import { MessageEmbed } from 'discord.js';
import { core, emotes } from '../../data/index.js';

export default {
    name: 'xp',
    execute: async(message, args, bot) => {
        // if (!devs.includes(message.author.id)) return message.reply(utils.createEmbed(message.author, 'RED', 'This command is temporarily disabled for maintenance'));
        const lbUsers = [];
        const msg = await message.channel.send({ embeds: [new MessageEmbed()
            .setDescription(`${emotes.loading} Loading leaderboards`)] });
        for await (const [, value] of levels.iterator())
            lbUsers.push({ id: value.id, level: value.level, xp: value.xp });
        const sortedArrxp = lbUsers.sort((a, b) => b.xp - a.xp);
        const sortedArr = sortedArrxp.sort((a, b) => b.level - a.level);
        const values = [...sortedArr];
        const max = Math.ceil(values.length / 10);
        const tagsCache = global.cache.get('tags');
        const options = { author: message.author, current: 1, maxValues: values.length, max: max };
        // thiss is an arr ['collectable name']
        const paginator = new Paginator(bot, message.channel, options, async(index, dat) => {
            let tag;
            const res = [];
            for (const i of sortedArr.slice(index, index + 10)) {
                const usertag = tagsCache.find(x => x.id == i.id);
                if (usertag) {
                    tag = usertag.tag;
                    res.push({ name: tag, xp: i.xp, level: i.level });
                } else {
                    const user = await utils.getID(i.id);
                    res.push({ name: user.tag, xp: i.xp, level: i.level });
                    global.cache.set('tags', { id: i.id, tag: user.tag });
                }
            }
            console.log(res[res.length - 1]);
            const str = toString(res, index);
            console.log(str);
            const obj = { embeds: [new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('Global Levels leaderboard')
                .setColor(core.embed)
                .setFooter(`${dat.page} out of ${max}`)
                .setDescription(`${str}`)
            ] };
            return obj;
        });
        await paginator.start();
        msg.delete();
    },
};
const toString = (users, increment) => users.map((x, i) => `**${i + 1 + increment}.** ${x.name} • Level \`${x.level}\` • XP \`${x.xp}\``).join('\n');

