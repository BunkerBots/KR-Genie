const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const utils = require('../../modules/messageUtils');
const db = require('../../modules/');

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
        const lbUsers = [];
        for (const i of values.splice((page - 1) * 10, page == max ? values.length % 10 : 10)) {
            const bankBal = i.balance.wallet + (sortByCash ? 0 : i.balance.bank);
            const user = await utils.getID(i.id);
            lbUsers.push({ name: user.username, balance: bankBal });
        }
        const embed = new MessageEmbed()
            .setAuthor('Global Leaderboard ' + (sortByCash ? 'Cash' : 'Networth'), message.client.user.avatarURL())
            .setDescription(toString(lbUsers.sort(sorter)))
            .setColor('GREEN')
            .setFooter(`Page ${page}/${max}`);
        message.channel.send(embed);
    },
};
const toString = (users) => users.map((x, i) => `**${Number(i) + 1}.** ${x.name} - ${x.balance}`).join('\n');
