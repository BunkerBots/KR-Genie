const mongo = require('../../mongo');
module.exports = {
    name: 'daily',
    aliases: ['rewards'],
    execute: async(message) => {
        mongo.dailyRewards(message.author.id, message);
    },
};
