import { dailyRewards, getLevel } from '../../modules/db/levels.js';
import { createEmbed } from '../../modules/messageUtils.js';

export default {
    name: 'daily',
    aliases: ['rewards'],
    cooldown: 10,
    description: 'Collect your daily krunkies here, being verified / premium user increases the daily rates!',
    expectedArgs: 'k/daily',
    execute: async(message) => {
        if (getLevel(message.author.id) < 5) return message.channel.send(createEmbed(message.author, 'RED', 'You must be above level 5 to use daily rewards'));
        dailyRewards(message.author.id, message);
    },
};
