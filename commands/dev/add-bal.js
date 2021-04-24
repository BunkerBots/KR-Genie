const data = require('../../data');
const db = require('../../modules');
module.exports = {
    name: 'add',
    execute: async(message, args) => {
        if (!(data.devs.includes(message.author.id) || data.staff.includes(message.author.id))) return;
        if (!args[0]) return message.reply(`Provide an user to add ${data.emotes.kr} to!`);
        const user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.reply('Unkown user!');

        const KR = args[1];
        if (isNaN(KR)) {
            message.reply('fam you need to specify a valid number of KR.');
            return;
        }
        const newKR = await db.utils.addKR(user.id, KR);

        message.reply(
            `You have given <@${user.id}> ${data.emotes.kr}${KR}. They now have ${data.emotes.kr}${newKR}!`,
        );
    },
};
