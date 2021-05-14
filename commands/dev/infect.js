const db = require('../../modules');
const { devs, staff, emotes } = require('../../data');
module.exports = {
    name: 'devinfect',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id))) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        await db.utils.infect(target.id);
        message.channel.send(`Successfully infected \`${target.username}\` ${emotes.krunkitis}`);
    },
};
