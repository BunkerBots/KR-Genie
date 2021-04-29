const utils = require('../../modules/messageUtils');
const db = require('../../modules/'),
    comma = require('../../modules/comma'),
    Paginator = require('../../modules/paginate');

module.exports = {
    name: 'lb',
    execute: async(message, args) => {
        const sortByCash = message.content.includes('--cash');
        message.content = message.content.replace('--cash', '');
        const sorter = sortByCash ? (x, y) => x.balance.wallet - y.balance.wallet : (x, y) => x.balance.wallet + x.balance.bank - (y.balance.wallet + y.balance.bank);
        const values = (await db.values()).sort(sorter).reverse();
        const max = Math.ceil(values.length / 10);
        let page = (args[0] || 1);
        if (page <= 0) return message.reply('Page no. has to be greater than 0, nitwit');
        if (page > max) page = max;

        const paginator = new Paginator(message.client, message.channel, {
            page,
            author: message.author,
            embed: {
                color: 'GREEN',
            },
            max,
            count: 10,
            maxValues: values.length,
        }, async(index, count) => {
            console.log('INDEX: ', index, count);
            const lbUsers = [];
            for (const i of [...values].splice(index, count)) {
                const bankBal = i.balance.wallet + (sortByCash ? 0 : i.balance.bank);
                const user = await utils.getID(i.id);
                lbUsers.push({ name: user.username, balance: bankBal });
            }
            return toString(lbUsers);
        });
        await paginator.start();
        return new Promise((resolve) => {
            paginator.on('end', resolve);
        });
    },
};
const toString = (users) => users.map((x, i) => `**${Number(i) + 1}.** ${x.name} - ${comma(x.balance)}`).join('\n');
