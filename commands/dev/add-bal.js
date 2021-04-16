const data = require('../../data');
module.exports = {
    name: 'add',
    execute: async(message, args) => {
        if (!data.developers.developers.includes(message.author.id)) return;
        const mention = message.mentions.users.first();

        if (!mention) {
            message.reply('Please tag a user to add KR to.');
            return;
        }

        const KR = args[2];
        if (isNaN(KR)) {
            message.reply('fam you need to specify a valid number of KR.');
            return;
        }

        const userID = mention.id;

        const newKR = await data.economy.addKR(userID, KR);

        message.reply(
            `You have given <@${userID}> ${data.emotes.kr}${KR}. They now have ${data.emotes.kr}${newKR}!`,
        );
    },
};
