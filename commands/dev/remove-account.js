const data = require('../../data');
module.exports = {
    name: 'remove',
    execute: async(message) => {
        if (!data.developers.developers.includes(message.author.id)) return;
        const mention = message.getMentions()?.[0];
        await data.economy.removeAcc(mention);
        message.channel.send(`Successfully erased all data for the user <@${mention}>`);
    },
};
