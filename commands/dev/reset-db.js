const db = require('../../modules');
const data = require('../../data');
module.exports = {
    name: 'resetdb',
    execute: async(message) => {
        if (!data.devs.includes(message.author.id)) return;
        await db.clear();
        message.channel.send('Successfully reset the database');
    },
};
