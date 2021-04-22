const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const utils = require('../../modules/messageUtils');
const db = require('../../modules/');

module.exports = {
    name: 'lb',
    execute: async(message) => {
        const arr = [new Object()];
        const embedArr = [];
        let sorter;
        if (message.content.includes('--cash')) sorter = (x, y) => x.balance.wallet - y.balance.wallet;
        else sorter = (x, y) => x.balance.wallet + x.balance.bank - (y.balance.wallet + y.balance.bank);
        const values = (await db.values()).sort(sorter);
        for (const i of values) {
            const bankBal = i.balance.bank;
            const user = await utils.getID(i.id);
            arr.push({ name: user.username, bal: bankBal });
        }
        const splicedarr = arr.splice(1);
        for (let i = 0; i < splicedarr.length ; i++) {
            // console.log(i)
            embedArr.push(`${parseInt([i]) + 1} ${splicedarr[i].name} : ${data.emotes.kr}${splicedarr[i].bal.bank}`);
        }
        const embed = new MessageEmbed()
            .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
            .setTitle('Global Ranking of Richest Users')
            .setDescription(`${embedArr.join('\n')}`)
            .setFooter('These are bank balance');
        console.log(embedArr);
        message.channel.send(embed);
    },
};
