const economy = require('../../scripts/economy');
const emotes = require('../../JSON/emotes.json')
module.exports = {
    name: 'add',
    execute: async (message , args) => {
        if (message.author.id !== '429493473259814923') return;
        const mention = message.mentions.users.first()

        if (!mention) {
            message.reply('Please tag a user to add KR to.')
            return
        }

        const KR = args[2]
        if (isNaN(KR)) {
            message.reply('fam you need to specify a valid number of KR.')
            return
        }

        const userID = mention.id

        const newKR = await economy.addKR(userID, KR)

        message.reply(
            `You have given <@${userID}> ${emotes.kr}${KR}. They now have ${emotes.kr}${newKR}!`
        )
    }
}