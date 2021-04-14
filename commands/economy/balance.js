const economy = require('../../scripts/economy');
const profileSchema = require('../../schemas/profile-schema')
module.exports = {
    name: 'bal',
    execute: async (message) => {
        const target = message.mentions.users.first() || message.author
        const targetID = target.id
        const userID = targetID
        const KR = await economy.balance(targetID)
        message.reply(`That user has ${KR} KR`)
    }
}