const profileSchema = require('../../schemas/profile-schema');
const economy = require('../../scripts/economy');
module.exports = {
    name: 'remove',
    execute: async (message) => {
        if (message.author.id !== '429493473259814923') return;
        const mention = message.mentions.users.first()
        userID = mention.id
        await economy.removeAcc(userID)
        message.channel.send(`Successfully erased all data for the user \`${mention.username}\``)

    }
}