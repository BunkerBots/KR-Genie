const { MessageEmbed } = require('discord.js');
const data = require('../../data');
const utils = require('../../modules/messageUtils');
const db = require('../../scripts/db');
module.exports = {
    name: 'lb',
    execute: async(message) => {
        const arr = [new Object()];
        const embedArr = [];
        const values = (await db.values()).sort(x => x.balance.wallet);
        const val = values.map(x => x.id);
        console.log(val);
        for (const i of val) {
            const wallet = await data.economy.balance(i);
            const user = await utils.getID(i);
            arr.push({ name: user.username, bal: wallet });
        }
        const splicedarr = arr.splice(1);
        const arranged = splicedarr.sort(function(a, b) {
            return b.bal.wallet - a.bal.wallet;
        });
        console.log(arranged);
        if (arranged.length < 11) {
        // eslint-disable-next-line no-undef
            for (i = 0; i < arranged.length ; i++) {
            // console.log(i)
            // eslint-disable-next-line no-undef
                embedArr.push(`\`${parseInt([i]) + 1}.\` ${arranged[i].name} : ${data.emotes.kr}${arranged[i].bal.wallet}`);
            }
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle('Top 10 Richest Users')
                .setDescription(`${embedArr.join('\n\u200b\n')}`)
                .setFooter('These are wallet balance');
            console.log(embedArr);
            message.channel.send(embed);
        } else {
            // eslint-disable-next-line no-undef
            for (i = 0; i < 10 ; i++) {
                // console.log(i)
                // eslint-disable-next-line no-undef
                embedArr.push(`\`${parseInt([i]) + 1}.\` ${arranged[i].name} : ${data.emotes.kr}${arranged[i].bal.wallet}`);
            }
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle('Top 10 Richest Users')
                .setDescription(`${embedArr.join('\n\u200b\n')}`)
                .setFooter('These are wallet balance');
            console.log(embedArr);
            message.channel.send(embed);
        }
    },
};
