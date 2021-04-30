const data = require('../../data');
const db = require('../../modules'),
    utils = require('../../modules/messageUtils'),
    comma = require('../../modules/comma');
module.exports = {
    name: 'give',
    aliases: ['pay', 'share'],
    cooldown: 5,
    description: `Feeling generous? Use this command to give some ${data.emotes.kr} to an user`,
    expectedArgs: 'k/give (ID / @user) (amount)',
    execute: async(message, args) => {
        if (!args[0]) return message.channel.send(`Who are you giving ${data.emotes.kr} to?`);
        const user = await message.guild.members.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.reply(await utils.createEmbed(message.author, 'RED', 'No user found nerd..'));
        const { wallet } = await db.utils.balance(message.author.id);
        const balance = await db.utils.balance(message.author.id);
        if (!args[1]) await message.reply(await utils.createEmbed(message.author, 'RED', 'You can\'t gift thin air you dumb'));
        if (user.id == message.author.id) return message.reply(await utils.createEmbed(message.author, 'RED', 'Why are you gifting yourself?...'));
        const krtogive = parseInt(utils.parse(args[1], balance));
        if (wallet <= 0) return message.channel.send(await utils.createEmbed(message.author, 'RED', `You don't have any ${data.emotes.kr} in your wallet`));
        if (wallet < krtogive) return message.channel.send(await utils.createEmbed(message.author, 'RED', `You do not have ${data.emotes.kr}${krtogive} in your wallet`));
        if (krtogive < 0) return message.reply(await utils.createEmbed(message.author, 'GREEN', `You gave <@${user.id}> ${data.emotes.kr}${comma(krtogive)} , now you have ${data.emotes.kr}${0} and they've got ${data.emotes.kr}${comma(krtogive)}.`).setFooter('Get jebaited lol, really think u can break me'));
        if (!Number.isInteger(krtogive)) return message.channel.send(await utils.createEmbed(message.author, 'RED', 'What are you doing? That\'s not even a valid number'));
        await db.utils.addKR(user.id, krtogive);
        await db.utils.addKR(message.author.id, -krtogive);
        const authorbal = await db.utils.balance(message.author.id);
        const userbal = await db.utils.balance(user.id);
        const giveEmbed = await utils.createEmbed(message.author, 'GREEN', `You gave <@${user.id}> ${data.emotes.kr}${comma(krtogive)} , now you have ${data.emotes.kr}${comma(authorbal.wallet)} and they've got ${data.emotes.kr}${comma(userbal.wallet)}.`);
        message.reply(giveEmbed);
    },
};
