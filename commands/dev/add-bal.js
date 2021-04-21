const data = require('../../data');
module.exports = {
    name: 'add',
    execute: async(message, args) => {
        if (!data.developers.developers.includes(message.author.id)) return;
        if (!args[1]) return message.reply(`Provide an user to add ${data.emotes.kr} to!`);
        const target = message.client.users.fetch(args[1].replace(/\D/g, ''));
        try {
            await target;
        } catch (error) {
            message.reply('Unknown user');
            return;
        }

        const KR = args[2];
        if (isNaN(KR)) {
            message.reply('fam you need to specify a valid number of KR.');
            return;
        }
        target.then(async user => {
            const newKR = await data.economy.addKR(user.id, KR);

            message.reply(
                `You have given <@${user.id}> ${data.emotes.kr}${KR}. They now have ${data.emotes.kr}${newKR}!`,
            );
        });
    },
};
