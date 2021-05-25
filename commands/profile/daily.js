import { dailyRewards } from '../../modules/db/levels.js';

export default {
    name: 'daily',
    aliases: ['rewards'],
    cooldown: 10,
    description: 'Collect your daily krunkies here, being verified / premium user increases the daily rates!',
    expectedArgs: 'k/daily',
    execute: async(message) => {
        dailyRewards(message.author.id, message);
    },
};
