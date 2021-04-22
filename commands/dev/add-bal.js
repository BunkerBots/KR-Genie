const data = require('../../data');
const db = require('../../modules');
module.exports = {
    name: 'add',
    execute: async(message, args) => {
        if (!data.devs.includes(message.author.id)) return;
        if (!args[1]) return message.reply(`Provide an user to add ${data.emotes.kr} to!`);
        const user = await message.client.users.fetch(args[1].replace(/\D/g, '')).catch(() => {});
        if (!user) message.reply('Unkown user!');

        const KR = args[2];
        if (isNaN(KR)) {
            message.reply('fam you need to specify a valid number of KR.');
            return;
        }
        const newKR = await db.addKR(user.id, KR);

        message.reply(
            `You have given <@${user.id}> ${data.emotes.kr}${KR}. They now have ${data.emotes.kr}${newKR}!`,
        );
    },
};
