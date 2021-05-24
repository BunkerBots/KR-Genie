/* eslint-disable no-unused-vars */
import { MessageEmbed } from 'discord.js';
import { emotes } from '../data/JSON/emotes.json';
import event from '../data/JSON/event.json';
import utils from '../modules/utils';
import Skins from '../modules/skins';
import db from '../modules/db';
// import { MessageEmbed } from 'discord.js';
// import { emotes } from '../../data/index';
const conductEvent = async(msg, args, bot) => {
    const winnerArr = [new Object()];
    const userNameArr = [];
    const randomEvent = event[Math.floor(Math.random() * event.length)];
    const randomMsg = randomEvent.key[Math.floor(Math.random() * randomEvent.key.length)];
    console.log(randomMsg);
    const eventEmbed = new MessageEmbed()
        .setAuthor(`${randomEvent.event}`)
        .setColor(`${randomEvent.rarity}`)
        .setDescription(`Type \`${randomMsg}\` in the chat in the next 10 seconds for a chance to win ${randomEvent.prize}`);
    const gmsg = await msg.channel.send(eventEmbed);
    const collector = msg.channel.createMessageCollector(x => x.author.id != bot.user.id && x.content.toLowerCase() == randomMsg.toLowerCase(), { time: 10000 });
    collector.on('collect', (recvMsg) => {
        const eventReward = parseInt(Math.floor(Math.random() * 1000) + 500);
        if (recvMsg.content.toLowerCase() == randomMsg.toLowerCase()) winnerArr.push({ id: recvMsg.author.id, username: recvMsg.author.username, reward: eventReward });
        console.log(winnerArr);
    });
    collector.on('end', async() => {
        for (const x of winnerArr.splice(1)) {
            if (randomEvent.type == 'kr') await db.utils.addKR(x.id, parseInt(x.reward));
            // else await db.utils.addSkin(x.id, eventReward[1]);
            userNameArr.push(`\`${x.username}\` ${getRandomWord()} ${emotes.kr}${x.reward}`);
        }
        const editEmbed = new MessageEmbed()
            .setColor('RED')
            .setAuthor(`${randomEvent.event}`)
            .setDescription(`${emotes.no} This even has expired`);
        gmsg.edit(editEmbed);
        const embed = new MessageEmbed()
            .setAuthor(`${randomEvent.event} has ended`)
            .setDescription(`${userNameArr.length != 0 ? userNameArr.join('\n') : 'No winners'}`)
            .setColor(`${userNameArr.length != 0 ? 'GREEN' : 'RED'}`);
        msg.channel.send(embed);
    });
};

// WIP, dont yeet this please
const randomSkin = utils.getRandomRaritySkin();

const getPrize = (type) => {
    if (type == 'kr') return parseInt();
    else if (type == 'skin') return [randomSkin.name, randomSkin.index, Skins.emoteColorParse(randomSkin.rarity)];
};
const getRandomWord = () => {
    const arr = ['got', 'won', 'bagged', 'yoinked'];
    const res = arr[Math.floor(Math.random() * arr.length)];
    return res;
};

export default { conductEvent };
export { conductEvent };
