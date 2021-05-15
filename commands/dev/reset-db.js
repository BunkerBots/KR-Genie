import db from '../../modules/db.js';
import { devs } from '../../data/index.js';
import logger from '../../modules/logger.js';

export default {
    name: 'resetdb',
    dev: true,
    execute: async(message) => {
        if (!devs.includes(message.author.id))
            return;
        await db.clear();
        message.channel.send('Successfully reset the database');
        logger.commandsLog(message.author, 'resedb', `**${message.author.tag}** (dev) reset DataBase`, message.guild, 'Reset: DataBase}');
    }
};
