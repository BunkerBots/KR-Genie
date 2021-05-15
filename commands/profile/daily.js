import mongo from '../../mongo';

module.exports = {
    name: 'daily',
    aliases: ['rewards'],
    cooldown: 10,
    description: 'Collect your daily krunkies here, being verified / premium user increases the daily rates!',
    expectedArgs: 'k/daily',
    execute: async(message) => {
        mongo.dailyRewards(message.author.id, message);
    },
};
