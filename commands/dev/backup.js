const { devs, staff } = require('../../data'),
    db = require('../../modules');
module.exports = {
    name: 'backup',
    aliases: ['dbbackup', 'backupdb'],
    dev: true,
    execute: async(message) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id))) return;
        await db.backup(message.channel);
    },
};

