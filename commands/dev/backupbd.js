// eslint-disable-next-line no-unused-vars
import { devs, staff } from '../../data/index.js';
import db from '../../modules/db.js';
import backup from '../../backups/BACKUP_Mon_May_24_2021_104953_GMT0000_Coordinated_Universal_Time.json';

export default {
    name: 'backupdb',
    aliases: [],
    dev: true,
    execute: async(message) => {
        if (!devs.includes(message.author.id)) return;
        backup.forEach(value => {
            db.set(value.id, value);
        });
        message.channel.send('db backup complete');
    },
};

