/* eslint-disable no-unused-vars */
import { MessageEmbed } from 'discord.js';
import emotes from '../data/JSON/emotes.json';
import event from '../data/JSON/event.json';
import utils from '../modules/utils.js';
import Skins from '../modules/skins.js';
import db from '../modules/db/economy.js';
// import { MessageEmbed } from 'discord.js';
// import { emotes } from '../../data/index';
const conductEvent = async(msg, args, bot) => {
    const winnerArr = [];
    const userNameArr = [];
    const randomEvent = event[Math.floor(Math.random() * event.length)];
    const randomMsg = randomEvent.key[Math.floor(Math.random() * randomEvent.key.length)];
    const eventEmbed = new MessageEmbed()
        .setAuthor(`${randomEvent.event}`)
        .setColor(`${randomEvent.rarity}`)
        .setDescription(`Type \`${randomMsg}\` in the chat in the next 10 seconds for a chance to win ${randomEvent.prize}`);
    const gmsg = await msg.channel.send({ embeds: [eventEmbed] });
    const filter = x => x.author.id != bot.user.id && x.content.toLowerCase() == randomMsg.toLowerCase();
    const collector = msg.channel.createMessageCollector({ filter, time: 10000 });
    collector.on('collect', (recvMsg) => {
        if (recvMsg.content.toLowerCase() == randomMsg.toLowerCase())
            winnerArr.push(recvMsg.author.id);
    });
    collector.on('end', async() => {
        const newArr = [...new Set(winnerArr)];
        for (const x of newArr) {
            const eventReward = parseInt(Math.floor(Math.random() * 1000) + 500);
            if (randomEvent.type == 'kr') await db.utils.addKR(x, parseInt(eventReward));
            // else await db.utils.addSkin(x.id, eventReward[1]);
            userNameArr.push(`<@${x}> ${getRandomWord()} ${emotes.kr}${eventReward}`);
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
        msg.channel.send({ embeds: [embed] });
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
