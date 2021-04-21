const data = require('../../data');
module.exports = {
    name: 'remove',
    execute: async(message) => {
        if (!data.developers.developers.includes(message.author.id)) return;
        const mention = message.getMentions()?.[0];
        const userID = mention.id;
        await data.economy.removeAcc(userID);
        message.channel.send(`Successfully erased all data for the user \`${mention.username}\``);
    },
};
