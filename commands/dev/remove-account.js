const data = require('../../data');
module.exports = {
    name: 'remove',
    execute: async(message, args) => {
        if (!data.developers.developers.includes(message.author.id)) return;
        if (!args[1]) return message.reply('Provide a user to initate this process');
        const target = message.client.users.fetch(args[1].replace(/\D/g, ''));
        try {
            await target;
        } catch (error) {
            message.reply('Unknown user');
            return;
        }
        target.then(async user => {
            await data.economy.removeAcc(user.id);
            message.channel.send(`Successfully erased all data for the user \`${user.username}\``);
        });
    },
};
