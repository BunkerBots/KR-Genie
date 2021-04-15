const dependencies = require('../../data/dependencies')
module.exports = {
    name: 'remove',
    execute: async (message) => {
        if (!dependencies.developers.developers.includes(message.author.id)) return;
        const mention = message.mentions.users.first()
        userID = mention.id
        await dependencies.economy.removeAcc(userID)
        message.channel.send(`Successfully erased all data for the user \`${mention.username}\``)
    }
}