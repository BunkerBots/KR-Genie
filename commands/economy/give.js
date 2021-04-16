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
        const walletbal = await data.economy.balance(message.author.id);
        if (walletbal <= 0) return message.channel.send(`You do not have enough ${data.emotes.kr}`);
        if (walletbal < args[2]) return message.channel.send(`You do not have ${data.emotes.kr}${args[2]}`);
        target.then(async user => {
            if (args[2].toLowerCase() === 'all') {
                await data.economy.addKR(user.id, walletbal);
                await data.economy.addKR(message.author.id, -walletbal);
                const authorallbal = await data.economy.balance(message.author.id);
                const userallbal = await data.economy.balance(user.id);
                message.reply(`You gave <@${user.id}> ${data.emotes.kr}${walletbal} , now you have ${data.emotes.kr}${authorallbal} and they've got ${data.emotes.kr}${userallbal}.`);
                return;
            }
            if (isNaN(args[2])) return message.channel.send('What are you doing? That\'s not even a valid number');

            await data.economy.addKR(user.id, args[2]);
            await data.economy.addKR(message.author.id, -args[2]);
            const authorbal = await data.economy.balance(message.author.id);
            const userbal = await data.economy.balance(user.id);
            message.reply(`You gave <@${user.id}> ${data.emotes.kr}${args[2]} , now you have ${data.emotes.kr}${authorbal} and they've got ${data.emotes.kr}${userbal}.`);
        });
    },
};
