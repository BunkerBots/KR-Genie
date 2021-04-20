const data = require('../../data');
module.exports = {
    name: 'give',
    aliases: ['pay', 'share'],
    execute: async(message, args) => {
        if (!args[1]) return message.channel.send(`Who are you giving ${data.emotes.kr} to?`);
        const target = message.guild.members.fetch(args[1].replace(/\D/g, ''));
        try {
            await target;
        } catch (e) {
            message.channel.send('Unknown user');
        }
        const { wallet } = await data.economy.balance(message.author.id);
        let krtogive = parseInt(args[2]);
        if (wallet <= 0) return message.channel.send(`You do not have enough ${data.emotes.kr}`);
        if (wallet < KRtogive) return message.channel.send(`You do not have ${data.emotes.kr}${args[2]}`);
        target.then(async user => {
            if (args[2].toLowerCase() === 'all') {
                await data.economy.addKR(user.id, parseInt(wallet));
                await data.economy.addKR(message.author.id, -parseInt(wallet));
                const authorallbal = await data.economy.balance(message.author.id);
                const userallbal = await data.economy.balance(user.id);
                message.reply(`You gave <@${user.id}> ${data.emotes.kr}${parseInt(wallet)} , now you have ${data.emotes.kr}${authorallbal.wallet} and they've got ${data.emotes.kr}${userallbal.wallet}.`);
                return;
            }
            if (isNaN(args[2])) return message.channel.send('What are you doing? That\'s not even a valid number');
            //const krtogive = parseInt(args[2])
            await data.economy.addKR(user.id, krtogive);
            await data.economy.addKR(message.author.id, -krtogive);
            const authorbal = await data.economy.balance(message.author.id);
            const userbal = await data.economy.balance(user.id);
            message.reply(`You gave <@${user.id}> ${data.emotes.kr}${krtogive} , now you have ${data.emotes.kr}${authorbal.wallet} and they've got ${data.emotes.kr}${userbal.wallet}.`);
        });
    },
};
