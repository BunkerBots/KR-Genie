const db = require('../../modules');
const data = require('../../data');
module.exports = {
    name: 'unverify',
    execute: async(message, args) => {
        if (!data.devs.includes(message.author.id) || !data.staff.includes(message.author.id)) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        await db.utils.unverify(target.id);
        message.channel.send(`Successfully unverified \`${target.username}\``);
    },
};
