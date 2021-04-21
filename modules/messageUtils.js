const { Message } = require('discord.js');
/**
 * @param {string} ID returns a user promise
 */

// eslint-disable-next-line no-unused-vars
module.exports.getID = async(args) => {
    // eslint-disable-next-line no-undef
    const message = new Message(client);
    const user = message.client.users.fetch(args.replace(/\D/g, ''));
    return user;
};
