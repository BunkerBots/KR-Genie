const items = require('../../data/items');
const db = require('../../modules');

const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    cooldown: 5,
    description: 'Displays the items owned by an user',
    expectedArgs: 'k/inventory [ID / @user]',
    execute: async(message, args) => {
        const skinsarr = [];
        let user;
        if (!args[0] || (Number.isInteger(parseInt(args[0])) && args[0].length < 5))
            user = message.author;
        else {
            const target = await message.client.users.fetch(args.shift().replace(/\D/g, '')).catch(() => {});
            if (!target) return message.reply('No user found!');
            else user = target;
        }
        let footer;
        let pageNumber;
        const dupes = new Map();
        const data = (await db.utils.itemInventory(user.id)).map(x => items.items[x])
            .filter(x => {
                const count = dupes.get(x.id) || 0;
                dupes.set(x.id, count + 1);
                return !count;
            });
        for (const item of data) {
            const count = dupes.get(item.id);
            skinsarr.push(`${item.icon} ${item.name}${count == 1 ? '' : ` x ${count}`}`);
        }
        /**
         * Creates an embed with skinsarr starting from an index.
         * @param {number} start The index to start from.
         */
        const generateEmbed = start => {
            const current = skinsarr.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`${user.username}'s Inventory`)
                .setDescription(`Showing items ${start + 1}-${start + current.length} out of ${skinsarr.length}`)
                .setFooter(footer);
            current.forEach(g => embed.addField(g, '\u200b'));
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

