const data = require('../../data'),
    { MessageEmbed } = require('discord.js'),
    db = require('../../modules'),
    logger = data.logger,
    comma = require('../../modules/comma'),
    // eslint-disable-next-line no-unused-vars
    levels = require('../../mongo');
module.exports = {
    name: 'work',
    aliases: ['work'],
    cooldown: 720,
    description: `A quick and easy way to get guaranteed amount of ${data.emotes.kr} from 500 - 1500.`,
    expectedArgs: 'k/work',
    execute: async(message, args) => {
        const workresponse = data.work.responses[Math.floor(Math.random() * data.work.responses.length)];
        const KR = parseInt(Math.floor(Math.random() * 1000) + 500);
        const userID = message.author.id;
        await db.utils.addKR(userID, KR);
        message.reply(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
            .setColor('GREEN')
            .setDescription(`${workresponse.replace('[kr]', `${data.emotes.kr}${comma(KR)}`)}.`));
        logger.commandsLog(message.author, 'work', `**${message.author.tag}** used \`work\` and recieved **${data.emotes.kr}${KR}**`, message.guild, args.join(' '), `KR: ${KR}`);
    },
};
