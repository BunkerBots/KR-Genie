const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const utils = require('../../modules/messageUtils');
const db = require('../../scripts/db');
module.exports = {
    name: 'lb',
    execute: async(message) => {
        const arr = [new Object()];
        const embedArr = [];
        const values = (await db.values()).sort(x => x.balance.bank);
        const val = values.map(x => x.id);
        console.log(val);
        for (const i of val) {
            const bankBal = await data.economy.balance(i);
            const user = await utils.getID(i);
            arr.push({ name: user.username, bal: bankBal });
        }
        console.log(arr);
        // eslint-disable-next-line no-undef
        for (i = 0; i < 30 ; i++) {
            // eslint-disable-next-line no-undef
            embedArr.push(`${parseInt([i])} ${arr[i].name} : ${emotes.kr}${arr[i].bal.wallet}`);
        }
        const embed = new MessageEmbed()
            .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
            .setTitle('Global Ranking of Richest Users')
            .setDescription(`${embedArr.splice(1).join('\n')}`)
            .setFooter('These are wallet balance');
        console.log(embedArr);
        message.channel.send(embed);
    },
};
