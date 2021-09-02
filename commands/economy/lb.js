import utils from '../../modules/messageUtils.js';
import db from '../../modules/db/economy.js';
import comma from '../../modules/comma.js';
// import Paginator from '../../modules/paginate.js';
import Paginator from '../../modules/paginator.js';
import { MessageEmbed } from 'discord.js';
import { core, emotes } from '../../data/index.js';

export default {
    name: 'lb',
    cooldown: 2,
    aliases: ['leaderboard', 'leaderboards', 'lbs', 'rich'],
    description: 'A command used to view the richest users of the bot.',
    expectedArgs: 'k/lb\nk/lb --cash',
    execute: async(message, args, bot) => {
        // if (!devs.includes(message.author.id)) return message.reply(utils.createEmbed(message.author, 'RED', 'This command is temporarily disabled for maintenance'));
        const sortByCash = message.content.includes('--cash');
        message.content = message.content.replace('--cash', '');
        const sorter = sortByCash ? (x, y) => x.balance.wallet - y.balance.wallet : (x, y) => x.balance.wallet + x.balance.bank - (y.balance.wallet + y.balance.bank);
        const values = (await db.values()).sort(sorter).reverse();
        const max = Math.ceil(values.length / 10);
        const tagsCache = global.cache.get('tags');
        const options = { author: message.author, current: 1, maxValues: values.length, max: max };
        // thiss is an arr ['collectable name']
        const paginator = new Paginator(bot, message.channel, options, async(index, dat) => {
            const lbUsers = [];
            let tag;
            for (const i of [...values].splice(index, index + 10)) {
                const bankBal = i.balance.wallet + (sortByCash ? 0 : i.balance.bank);
                const usertag = tagsCache.find(x => x.id == i.id);
                if (usertag) {
                    tag = usertag.tag;
                    lbUsers.push({ name: tag, balance: bankBal });
                } else {
                    const user = await utils.getID(i.id);
                    lbUsers.push({ name: user.tag, balance: bankBal });
                    global.cache.set('tags', { id: i.id, tag: user.tag });
                }
            }
            const str = toString(lbUsers, index);
            // const str = lbUsers.map((x, i) => `${i + 1 + index} ${x.name} - \`${comma(x.balance)}\``);
            const obj = { embeds: [new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setColor(core.embed)
                .setFooter(`${dat.page} out of ${max}`)
                .setDescription(`${str}`)
            ] }; // return embed
            return obj;
        });
        const msg = await message.channel.send({ embeds: [new MessageEmbed()
            .setDescription(`${emotes.loading} Loading leaderboards`)] });
        await paginator.start();
        msg.delete();
    },
};
const toString = (users, increment) => users.map((x, i) => `**${i + 1 + increment}.** ${x.name} - \`${comma(x.balance)}\``).join('\n');
