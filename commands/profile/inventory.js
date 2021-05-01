const items = require('../../data/items'),
    db = require('../../modules'),
    Paginator = require('../../modules/paginate');

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

        const generateEmbed = (start, count) => skinsarr.slice(start, start + count).join('\n');

        let page = args.shift();
        const max = Math.ceil(skinsarr.length / 10);
        if (!Number.isInteger(page)) page = 1;
        if (page <= 0) return message.reply('Page no. has to be greater than 0, nitwit');
        if (page > max) page = max;

        const paginator = new Paginator(message.client, message.channel, {
            page,
            max,
            embed: {
                color: 'GREEN',
            },
            count: 10,
            maxValues: skinsarr.length,
        }, generateEmbed);

        await paginator.start();
        return new Promise((resolve) => {
            paginator.on('end', resolve);
        });
    },
};

