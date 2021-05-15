import { clear } from '../../modules/db.js';
import { devs } from '../../data/index.js';
import { commandsLog } from '../../modules/logger.js';

export default {
    name: 'resetdb',
    dev: true,
    execute: async(message) => {
        if (!devs.includes(message.author.id))
            return;
        await clear();
        message.channel.send('Successfully reset the database');
        commandsLog(message.author, 'resedb', `**${message.author.tag}** (dev) reset DataBase`, message.guild, 'Reset: DataBase}');
    }
};
