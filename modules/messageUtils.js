const { Message } = require('discord.js');
let client;
module.exports.load = (localClient) => {
    client = localClient;
};
/**
 * @param {string} ID returns a user promise
 */
Message.prototype.getID = function(args) {
    // eslint-disable-next-line no-undef
    const user = client.users.fetch(args.replace(/\D/g, ''));
    return user;
};

module.exports.getID = function(args) {
    // eslint-disable-next-line no-undef
    const user = client.users.fetch(args.replace(/\D/g, ''));
    return user;
};
