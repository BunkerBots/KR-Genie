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

Message.prototype.parse = function(arg, balance) {
    let bet = 1;
    if (!arg) throw new Error('No args');
    if (arg.includes(' ')) throw new Error('found space in <Message>.parse');

    if (arg == 'all' || arg == 'a') return balance.wallet;
    if (arg == 'half' || arg == 'h') return balance.wallet * 1 / 2;
    if (arg == 'quarter' || arg == 'q' || arg == 'quart') return balance.wallet * 1 / 4;

    const regex = /(\d*)([e|k|m|b]?)(\d*)/i;
    if (!regex.test(arg)) return 0;
    if (arg.includes('e')) {
        let power;
        arg = arg.replace(/e(\d)*/i, (...args) => {
            power = args[1];
            return '';
        });
        bet *= Math.pow(10, power);
    }
    const rek = /(\d*)([k|m|b])/;
    if (!rek.test(arg)) return bet *= arg;
    if (arg.includes('k')) {
        arg = arg.replace('k', '');
        bet *= Math.pow(10, 3);
    } else if (arg.includes('m')) {
        arg = arg.replace('m', '');
        bet *= Math.pow(10, 6);
    } else if (arg.includes('b')) {
        arg = arg.replace('b', '');
        bet *= Math.pow(10, 9);
    }
    if (isNaN(arg)) return 0;
    else return bet *= arg;
};
const regex = /(\d*)([e|k|m|b]?)(\d*)/i;
const rek = /(\d*)([k|m|b])/;

module.exports.parse = function(arg, balance) {
    let bet = 1;
    if (arg.includes(' ')) throw new Error('found space in <Message>.parse');

    if (arg == 'all' || arg == 'a') return balance.wallet;
    if (arg == 'half' || arg == 'h') return balance.wallet * 1 / 2;
    if (arg == 'quarter' || arg == 'q' || arg == 'quart') return balance.wallet * 1 / 4;

    if (!regex.test(arg)) return 0;
    if (arg.includes('e')) {
        let power;
        arg = arg.replace(/e(\d)*/i, (...args) => {
            power = args[1];
            return '';
        });
        bet *= Math.pow(10, power);
    }
    if (!rek.test(arg)) return bet *= arg;
    if (arg.includes('k')) {
        arg = arg.replace('k', '');
        bet *= Math.pow(10, 3);
    } else if (arg.includes('m')) {
        arg = arg.replace('m', '');
        bet *= Math.pow(10, 6);
    } else if (arg.includes('b')) {
        arg = arg.replace('b', '');
        bet *= Math.pow(10, 9);
    }
    if (isNaN(arg)) return 0;
    else return bet *= arg;
};


module.exports.getEmbedColor = async(level) => {
    let color;
    if (level >= 15) color = '#ff6a00';
    else if (level >= 30) color = '#cc00ff';
    else if (level >= 45) color = '#ff0000';
    else if (level >= 60) color = '';
    else if (level >= 75) color = '';
    else if (level >= 90) color = '';
    else if (level >= 100) color = '';
    return color;
};
