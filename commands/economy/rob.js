const data = require('../../data');
module.exports = {
    name: 'rob',
    aliases: ['steal'],
    cooldown: 120,
    execute: async(message, args) => {
        if (!args[1]) return message.reply('Who are we robbing?');
        const target = message.guild.members.fetch(args[1].replace(/\D/g, ''));
        try {
            await target;
        } catch (e) {
            message.channel.send('Unknown user');
            return;
        }
        const robchance = Math.floor(Math.random() * 2);
        target.then(async user => {
            if (user.id === message.author.id) return message.reply('Did you just try to rob yourself?..');
            if (robchance == 1) {
                const { wallet } = await data.economy.balance(user.id);
                if (wallet <= 0) return message.reply('You can\'t rob a guy with empty wallet , get a standard bro');

                const robbedKR = Math.floor(Math.random() * wallet);
                await data.economy.addKR(user.id, -robbedKR);
                await data.economy.addKR(message.author.id, robbedKR);
                message.reply(`You stole a sweet amount of ${data.emotes.kr}${robbedKR} from ${user.user.username}`);
            } else {
                await data.economy.addKR(message.author.id, -250);
                message.reply(`You were caught stealing and lost ${data.emotes.kr}250`);
            }
        });
    },
};
