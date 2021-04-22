const data = require('../../data');
const db = require('../../modules');
module.exports = {
    name: 'give',
    aliases: ['pay', 'share'],
    execute: async(message, args) => {
        if (!args[0]) return message.channel.send(`Who are you giving ${data.emotes.kr} to?`);
        const user = await message.guild.members.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.reply('No user found nerd..');
        const { wallet } = await db.utils.balance(message.author.id);
        const krtogive = parseInt(args[1]);
        if (wallet <= 0) return message.channel.send(`You do not have enough ${data.emotes.kr}`);
        if (wallet < krtogive) return message.channel.send(`You do not have ${data.emotes.kr}${args[2]}`);
        if (args[2].toLowerCase() === 'all') {
            await db.utils.addKR(user.id, parseInt(wallet));
            await db.utils.addKR(message.author.id, -parseInt(wallet));
            const authorallbal = await db.utils.balance(message.author.id);
            const userallbal = await db.utils.balance(user.id);
            message.reply(`You gave <@${user.id}> ${data.emotes.kr}${parseInt(wallet)} , now you have ${data.emotes.kr}${authorallbal.wallet} and they've got ${data.emotes.kr}${userallbal.wallet}.`);
            return;
        }
        if (isNaN(args[1])) return message.channel.send('What are you doing? That\'s not even a valid number');
        // const krtogive = parseInt(args[2])
        await db.utils.addKR(user.id, krtogive);
        await db.utils.addKR(message.author.id, -krtogive);
        const authorbal = await db.utils.balance(message.author.id);
        const userbal = await db.utils.balance(user.id);
        message.reply(`You gave <@${user.id}> ${data.emotes.kr}${krtogive} , now you have ${data.emotes.kr}${authorbal.wallet} and they've got ${data.emotes.kr}${userbal.wallet}.`);
    },
};
