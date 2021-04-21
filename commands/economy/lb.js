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
        const splicedarr = arr.splice(1);
        // eslint-disable-next-line no-undef
        for (i = 0; i < splicedarr.length ; i++) {
            // console.log(i)
            // eslint-disable-next-line no-undef
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
