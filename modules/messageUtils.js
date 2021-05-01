const { Message } = require('discord.js'),
    db = require('../mongo'),
    { MessageEmbed } = require('discord.js');
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

const regex = /(\d*)([e|k|m|b]?)(\d*)/i;
const rek = /(\d*)([k|m|b])/;

const parse = function(arg, balance) {
    // Remove negative numbers
    arg = arg.replace('-', '');
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
Message.prototype.parse = parse;
Message.prototype.embed = async function(option, { returnEmbed = false, color = '#6600FF' }) {
    let embed;
    if (option instanceof MessageEmbed)
        embed = option;
    else embed = new MessageEmbed().setDescription(option);
    embed.setAuthor(this.author, this.author.avatarURL({ dynamic: true })).setColor(color);

    return returnEmbed ? embed : this.channel.send(embed);
};
module.exports.parse = parse;

const parseBank = function(arg, balance) {
    let bet = 1;
    if (arg.includes(' ')) throw new Error('found space in <Message>.parse');

    if (arg == 'all' || arg == 'a') return balance.bank;
    if (arg == 'half' || arg == 'h') return balance.bank * 1 / 2;
    if (arg == 'quarter' || arg == 'q' || arg == 'quart') return balance.bank * 1 / 4;

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

Message.prototype.parseBank = parseBank;

module.exports.parseBank = parseBank;

module.exports.getEmbedColor = async(level) => {
    let color;
    if (level < 15) color = '#777a77';
    else if (level >= 15) color = '#0f69fa';
    else if (level >= 30) color = '#ed0ffc';
    else if (level >= 45) color = '#dfff0f';
    else if (level >= 60) color = '#ff0f0f';
    else if (level >= 75) color = '#050505';
    else if (level >= 90) color = '#19f7e9';
    else if (level >= 100) color = '#22c716';
    return color;
};

module.exports.parseEmbedColor = async(level) => {
    let color;
    if (level < 15) color = 'Gray';
    else if (level >= 15) color = 'Blue';
    else if (level >= 30) color = 'Pink';
    else if (level >= 45) color = 'Yellow';
    else if (level >= 60) color = 'Red';
    else if (level >= 75) color = 'Black';
    else if (level >= 90) color = 'Cyan';
    else if (level >= 100) color = 'Green';
    return color;
};


module.exports.color = async(user) => {
    const level = await db.getLevel(user.id);
    const color = await this.getEmbedColor(level);
    return color;
};

module.exports.createEmbed = (user, color, description) => {
    const embed = new MessageEmbed()
        .setAuthor(user.username, user.displayAvatarURL({ dynamic: false }))
        .setDescription(description)
        .setColor(color);
    return embed;
};
