const dependencies = require('../../data'),
    utils = require('../../modules/utils');
module.exports = {
    name: 'test',
    aliases: ['lb'],
    execute: async(message) => {
        const i = await utils.useItem(message.author.id, 'padlock');
        // console.log(i);
    },
};
