const dependencies = require('../../data/dependencies')
module.exports = {
    name: 'rob',
    cooldown: 120,
    execute: async (message, args) => {
        if (!args[1]) return message.reply('Who are we robbing?')
        const target = message.guild.members.fetch(args[1].replace(/\D/g, ''));
        try {
            await target
        } catch (e) {
            message.channel.send('Unknown user')
            return;
        }
        const robchance = Math.floor(Math.random() * 2)
        target.then(async user => {
            if (user.id === message.author.id) return message.reply('Did you just try to rob yourself?..')
            if (robchance == 1) {
                const KR = await dependencies.economy.balance(user.id)
                if (KR <= 0) return message.reply('You can\'t rob a guy with empty wallet , get a standard bro')

                const robbedKR = Math.floor(Math.random() * KR)
                await dependencies.economy.addKR(user.id, -robbedKR)
                await dependencies.economy.addKR(message.author.id, robbedKR)
                message.reply(`You stole a sweet amount of ${dependencies.emotes.kr}${robbedKR} from ${user.user.username}`)

            } else {
                await dependencies.economy.addKR(message.author.id, -250)
                message.reply(`You were caught stealing and lost ${dependencies.emotes.kr}250`)
            }
        })


    }
}