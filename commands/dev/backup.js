import { devs, staff } from '../../data';
import { backup } from '../../modules';


export default {
    name: 'backup',
    aliases: ['dbbackup', 'backupdb'],
    dev: true,
    execute: async(message) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
            return;
        await backup(message.channel);
    }
};

