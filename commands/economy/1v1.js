const data = require('../../data'),
    db = require('../../modules'),
    utils = require('../../modules/messageUtils');
module.exports = {
    name: '1v1',
    aliases: ['duel'],
    cooldown: 25,
    execute: async(message, args) => {
        if (!data.testers.includes(message.author.id)) return;
        const { wallet } = await db.utils.balance(message.author.id);
        if (!args[0]) return message.reply('SMH you can\'t 1v1 yourself , tag a user');
        if (!args[1]) return message.reply(`What are you betting? provide a valid amount of ${data.emotes.kr}`);
        const bet = parseInt(utils.parse(args[1]));
        if (wallet <= 0) return message.reply('You can\'t bet thin air');
        if (bet > wallet) return message.reply(`You do not have ${data.emotes.kr}${bet} in your wallet`);
        if (!Number.isInteger(bet)) return message.reply(`Provide a valid amount of ${data.emotes.kr} smh`);
        const member = await message.guild.members.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!member)
            return message.reply('Unknown user');

        const memberwallet = await db.utils.balance(member.id);
        if (member.id === message.author.id) return message.reply('Sorry you can\'t 1v1 yourself...');
        if (member.user.bot === true) return message.reply('You can\'t 1v1 bots , they\'re too powerful for you');
        if (bet > memberwallet.wallet) return message.reply(`${member.user.username} does not have ${data.emotes.kr}${bet} to bet!`);
        const msg = await message.channel.send(`<@${member.id}> , <@${message.author.id}> is challenging you to a ${data.emotes.kr}${bet} duel\nReply with \`accept\` to fight\nReply with \`decline\` to bail`);
        const collected = await msg.channel.awaitMessages(m => m.author.id === member.id,
            {
                max: 1,
                time: 15000,
                errors: ['time'],
            })
            .catch(() => {
                msg.delete();
                message.channel.send('Match has been cancelled due to inactivity');
            });
        if (collected.first().content.toLowerCase() === 'accept') {
            const RNG = Math.floor(Math.random() * 2);
            if (RNG === 1) {
                message.channel.send(`<@${member.id}> has won the duel , ${data.emotes.kr}${bet}`);
                await db.utils.addKR(message.author.id, -bet);
                await db.utils.addKR(member.id, bet);
            } else {
                message.channel.send(`<@${message.author.id}> has won the duel , ${data.emotes.kr}${bet}`);
                await db.utils.addKR(message.author.id, bet);
                await db.utils.addKR(member.id, -bet);
            }
        } else if (collected.first().content.toLowerCase() === 'decline')
            message.channel.send(`${member.user.username} bailed from the duel , smh`);

        else
            message.channel.send('Uknown response');
    },
};
