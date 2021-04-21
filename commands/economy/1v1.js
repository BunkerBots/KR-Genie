const data = require('../../data');
module.exports = {
    name: '1v1',
    aliases: ['duel'],
    cooldown: 25,
    execute: async(message, args) => {
        //         if(!data.betaTesters.testers.includes(message.author.id)) return;
        const { wallet } = await data.economy.balance(message.author.id);
        if (!args[1]) return message.reply('SMH you can\'t 1v1 yourself , tag a user');
        let KR;
        if (!args[2]) return message.reply(`What are you betting? provide a valid amount of ${data.emotes.kr}`);
        if (args[2].toLowerCase() === 'all') KR = parseInt(wallet);
        else KR = parseInt(args[2]);
        if (wallet <= 0) return message.reply('You can\'t bet thin air');
        if (KR > wallet) return message.reply(`You do not have ${data.emotes.kr}${KR} in your wallet`);
        if (!Number.isInteger(KR)) return message.reply(`Provide a valid amount of ${data.emotes.kr} smh`);
        const mention = message.getMentions(args[1])?.[0];
        if (!mention) return message.reply('No Mention/User ID was found!')
        const member = await message.guild.members.fetch(args[1].replace(/\D/g, '')).catch(()=>{});
        if (!member) return message.reply('Invalid User/Mention!');
        if (member.id === message.author.id) return message.reply('Sorry you can\'t 1v1 yourself...');
        if (member.user.bot === true) return message.reply('You can\'t 1v1 bots , they\'re too powerful for you');

        const memberWallet = await data.economy.balance(member.id);
        if (KR > memberWallet.wallet) return message.reply(`${member.user.username} does not have ${data.emotes.kr}${KR} to bet!`);
        const msg = await message.channel.send(`<@${member.id}> , <@${message.author.id}> is challenging you to a ${data.emotes.kr}${KR} duel\nReply with \`accept\` to fight\nReply with \`decline\` to bail`)
        const collected = await message.channel.awaitMessages(m => m.author.id === member.id,
            {
                max: 1,
                time: 15000,
                errors: ['time'],
            }).catch(() => {
                msg.delete();
                message.channel.send('Match has been cancelled due to inactivity');
            });
        if (collected.first().content.toLowerCase() === 'accept') {
            const RNG = Math.floor(Math.random() * 2);
            if (RNG === 1) {
                message.channel.send(`<@${member.id}> has won the duel , ${data.emotes.kr}${KR}`);
                await data.economy.addKR(message.author.id, -KR);
                await data.economy.addKR(member.id, KR);
            } else {
                message.channel.send(`<@${message.author.id}> has won the duel , ${data.emotes.kr}${KR}`);
                await data.economy.addKR(message.author.id, KR);
                await data.economy.addKR(member.id, -KR);
            }
        } else if (collected.first().content.toLowerCase() === 'decline')
            message.channel.send(`${member.user.username} bailed from the duel , smh`);
        else
            message.channel.send('Uknown response');
    },
};
