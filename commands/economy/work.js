import data from '../../data';
import { MessageEmbed } from 'discord.js';
import db from '../../modules';
import comma from '../../modules/comma';
import logger from '../../modules/logger';
// eslint-disable-next-line no-unused-vars
import levels from '../../mongo';


export default {
    name: 'work',
    aliases: ['work'],
    cooldown: 600,
    description: `A quick and easy way to get guaranteed amount of ${data.emotes.kr} from 500 - 1500.`,
    expectedArgs: 'k/work',
    execute: async(message, args) => {
        const krunkitis = await db.utils.krunkitis(message.author.id);
        let KR, footer, boostKR;
        const premium = await db.utils.premium(message.author.id);
        if (premium == true) boostKR = 1500;
        else boostKR = 1000;
        const workresponse = data.work.responses[Math.floor(Math.random() * data.work.responses.length)];
        const randomKR = parseInt(Math.floor(Math.random() * boostKR) + 500);
        const tenpercent = (randomKR * 10) / 100;
        if (krunkitis == false) {
            footer = '';
            KR = randomKR;
        } else {
            KR = parseInt(randomKR - tenpercent);
            footer = '- 10% because you are infected';
        }
        const userID = message.author.id;
        await db.utils.addKR(userID, KR);
        message.reply(new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
            .setColor('GREEN')
            .setDescription(`${workresponse.replace('[kr]', `${data.emotes.kr}${comma(KR)}`)}.`)
            .setFooter(footer));
        logger.commandsLog(message.author, 'work', `**${message.author.tag}** used \`work\` and recieved **${data.emotes.kr}${KR}**`, message.guild, args.join(' '), `KR: ${KR}`);
    },
};
