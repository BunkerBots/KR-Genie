const data = require('../../data');
module.exports = {
    name: 'add',
    execute: async(message, args) => {
        if (!data.developers.developers.includes(message.author.id)) return;
        const mention = message.getMentions()?.[0];

        if (!mention) {
            message.reply('Please tag a user to add KR to.');
            return;
        }

        const KR = args[2];
        if (isNaN(KR)) {
            message.reply('fam you need to specify a valid number of KR.');
            return;
        }

        const newKR = await data.economy.addKR(mention, KR);

        message.reply(
            `You have given <@${mention}> ${data.emotes.kr}${KR}. They now have ${data.emotes.kr}${newKR}!`,
        );
    },
};
