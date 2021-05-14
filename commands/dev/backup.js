import { devs, staff } from '../../data';
import { backup } from '../../modules';


export const name = 'backup';
export const aliases = ['dbbackup', 'backupdb'];
export const dev = true;
export async function execute(message) {
    if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
        return;
    await backup(message.channel);
}

