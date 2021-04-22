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
        const values = (await db.values()).sort(sorter).reverse();
        for (const i of values) {
            const bankBal = i.balance.bank;
            const user = await utils.getID(i.id);
            arr.push({ name: user.username, bal: bankBal });
        }
        const splicedarr = arr.splice(1);
        console.log(splicedarr)
        for (let i = 0; i < splicedarr.length ; i++) {
            embedArr.push(`${parseInt([i]) + 1} ${splicedarr[i].name} : ${data.emotes.kr}${splicedarr[i].bal.bank}`);
            if (values.length < 11) {
                // eslint-disable-next-line no-undef
                for (i = 0; i < values.length ; i++) {
                    // console.log(i)
                    // eslint-disable-next-line no-undef
                    embedArr.push(`\`${parseInt([i]) + 1}.\` ${values[i].name} : ${data.emotes.kr}${values[i].bal.wallet}`);
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
                    console.log(values[i]);
                    embedArr.push(`\`${parseInt([i]) + 1}.\` ${values[i].name} : ${data.emotes.kr}${values[i].balance.wallet}`);
                }
                const embed = new MessageEmbed()
                    .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                    .setTitle('Top 10 Richest Users')
                    .setDescription(`${embedArr.join('\n\u200b\n')}`)
                    .setFooter('These are wallet balance');
                console.log(embedArr);
                message.channel.send(embed);
            }
        }
    },
};
