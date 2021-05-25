import { devs, staff } from '../../data/index.js';

import economy_db from '../../modules/db/economy.js';
import market_db from '../../modules/db/market.js';
import levels_db from '../../modules/db/levels.js';

export default {
    name: 'backup',
    aliases: [],
    dev: true,
    execute: async(message) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
            return;
        await Promise.all([
            economy_db.backup(message.channel),
            levels_db.backup(message.channel),
            market_db.backup(message.channel),
        ]);
    }
};

