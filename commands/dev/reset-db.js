import { clear } from '../../modules';
import { devs } from '../../data';
import { commandsLog } from '../../modules/logger';

export const name = 'resetdb';
export const dev = true;
export async function execute(message) {
    if (!devs.includes(message.author.id))
        return;
    await clear();
    message.channel.send('Successfully reset the database');
    commandsLog(message.author, 'resedb', `**${message.author.tag}** (dev) reset DataBase`, message.guild, 'Reset: DataBase}');
}
