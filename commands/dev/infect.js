const db = require('../../modules');
const data = require('../../data');
module.exports = {
    name: 'infect',
    execute: async(message, args) => {
        if (!data.devs.includes(message.author.id)) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        db.utils.infect(target.id);
        message.channel.send(`Successfully infected \`${target.username}\` ${data.emotes.krunkitis}`);
    },
};
