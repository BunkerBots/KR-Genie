import { devs, staff, emotes } from '../../data/index.js';
import db from '../../modules/db/economy.js';
import event from '../../data/JSON/unob.json';
import { MessageEmbed } from 'discord.js';
import utils from '../../modules/utils.js';
import Skins from '../../modules/skins.js';


export default {

    name: 'unob',
    aliases: ['unobevent'],
    description: 'A command available for devs and staff to spawn KR',
    expectedArgs: 'k/add (@user) (amount)',
    cooldown: 0,
    dev: true,
    execute: async(msg, args, bot) => {
        if (!(devs.includes(msg.author.id) || staff.includes(msg.author.id))) return;
        const winnerArr = [];
        const userArr = [];
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
            if (recvMsg.content.toLowerCase() == randomMsg.toLowerCase())
                winnerArr.push(recvMsg.author.id);

            console.log(winnerArr);
        });
        collector.on('end', async() => {
            const newArr = winnerArr.length != 0 ? [...new Set(winnerArr)] : [];
            const rng = Math.floor(Math.random() * newArr.length);
            const { sorted } = Skins;
            const skin = sorted[6][Math.floor(Math.random() * sorted[6].length)];
            const winner = newArr.length != 0 ? newArr[rng] : [];
            console.log(winner);
            userArr.push(`<@${winner}> won ${emotes.unobtainable}${skin.name}`);
            await db.utils.addSkin(winner, skin.index);
            const editEmbed = new MessageEmbed()
                .setColor('RED')
                .setAuthor(`${randomEvent.event}`)
                .setDescription(`${emotes.no} This even has expired`);
            gmsg.edit(editEmbed);
            const embed = new MessageEmbed()
                .setAuthor(`${randomEvent.event} has ended`)
                .setDescription(`${winner.length != 0 ? userArr[0] : 'No winners'}`)
                .setColor(`${winner.length != 0 ? 'GREEN' : 'RED'}`);
            msg.channel.send(embed);
        });

        // WIP, dont yeet this please
        const randomSkin = utils.getRandomRaritySkin();

        // eslint-disable-next-line no-unused-vars
        const getPrize = (type) => {
            if (type == 'kr') return parseInt();
            else if (type == 'skin') return [randomSkin.name, randomSkin.index, Skins.emoteColorParse(randomSkin.rarity)];
        };
        // eslint-disable-next-line no-unused-vars
        const getRandomWord = () => {
            const arr = ['got', 'won', 'bagged', 'yoinked'];
            const res = arr[Math.floor(Math.random() * arr.length)];
            return res;
        };
    }
};

