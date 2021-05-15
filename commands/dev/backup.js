import { devs, staff } from '../../data/index.js';
import db from '../../modules/db.js';


export default {
    name: 'backup',
    aliases: ['dbbackup', 'backupdb'],
    dev: true,
    execute: async(message) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
            return;
        await db.backup(message.channel);
    }
};

