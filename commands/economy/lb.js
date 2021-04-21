const db = require('../../scripts/db');
module.exports = {
    name: 'lb',
    execute: async(message) => {
        const values = (await db.values()).sort(x => x.balance.bank);
        message.reply(values.map(x => x.id).join('\n'));
    },
};
