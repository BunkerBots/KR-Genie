const db = require('../../modules'),
    data = require('../../data'),
    devs = data.devs,
    logger = data.logger;
module.exports = {
    name: 'resetdb',
    dev: true,
    execute: async(message) => {
        if (!devs.includes(message.author.id)) return;
        await db.clear();
        message.channel.send('Successfully reset the database');
        logger.commandsLog(message.author, 'resedb', `**${message.author.tag}** (dev) reset DataBase`, message.guild, 'Reset: DataBase}');
    },
};
