const dependencies = require('../../data');
module.exports = {
    name: 'test',
    aliases: ['lb'],
    execute: async(m) => {
        const arr = new Array();
        try {
            // excuse me wtf is this?
            await m.guild.members.cache.forEach(async member => {
                const { wallet } = await dependencies.economy.balance(member.id);
                if (wallet <= 0) return;
                await arr.push(wallet);
                console.log(wallet);
            });
        } finally {
            console.log(arr);
        }
    },
};
