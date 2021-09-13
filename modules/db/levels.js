/* eslint-disable prefer-const */
import { MessageEmbed } from 'discord.js';
import DBClient from './Db.js';
import economy from './economy.js';
import { emotes } from '../../data/index.js';
import comma from '../comma.js';

const db = new DBClient('levels');

class DBUtils {

    constructor(keyv) {
        this.keyv = keyv;
    }

    async get(id) {
        let val = await this.keyv.get(id);
        if (!val) {
            val = {
                xp: 0,
                level: 1,
                id: id,
            };
        }
        return val;
    }

    async stamp(id) {
        const val = await this.get(id);
        val.updatedAt = Date.now();
        this.keyv.set(id, val);
        return this;
    }

}

db.utils = new DBUtils(db.keyv);

const getNeededXP = (level) => level * level * 100;
const levelReward = (level) => level * 1000;

export const addXP = async(userId, xpToAdd, message) => {
    const user = await db.utils.get(userId);
    user.xp += xpToAdd;

    const needed = getNeededXP(user.level);
    const reward = levelReward(user.level);
    if (user.xp >= needed) {
        ++user.level;
        user.xp -= needed;

        message.reply({ embeds: [new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
            .setColor('GREEN')
            .setDescription(`You leveled up! \`${user.level - 1} => ${user.level}\` with \`${user.xp}\` experience! As a reward ${emotes.kr}${parseInt(reward)} has been placed in your wallet!`)
            .setTimestamp()], failIfNotExists: false });
        await economy.utils.addKR(userId, parseInt(reward));
    }
    await db.set(userId, user);
};

export async function getXP(userId) {
    const res = await db.utils.get(userId);
    const { xp, level } = res;
    const needed = getNeededXP(level);
    return [xp, needed];
}

export async function getLevel(userId) {
    const res = await db.utils.get(userId);
    const { level } = res;
    return [level];
}

export async function dailyRewards(userId, message) {
    let reward = 2500;
    let footer = '';
    const eco_user = await economy.utils.get(userId);
    if (eco_user.verified == true) reward = 3000, footer = 'Verified Perks + 500 KR reward';
    if (eco_user.premium == true) reward = 4000, footer = 'Premium Perks + 1500 KR reward';


    const result = await db.utils.get(userId);
    if (result) {
        const then = result.updatedAt;
        const now = Date.now();
        const diffTime = Math.abs(now - then);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        // const t = parseInt(now - then); // without abs
        const canVoteAt = new Date(then + (1000 * 60 * 60 * 24));
        if (diffDays < 1) {
            message.reply({ embeds: [new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle('You\'ve already claimed your daily today')
                .setColor('RED')
                .setDescription(`You can claim your daily again at : \n**${canVoteAt.toLocaleString()}**`)], allowedMentions: { repliedUser: false }, failIfNotExists: false });
            return;
        }
    }

    await db.utils.stamp(userId);
    await economy.utils.addKR(userId, parseInt(reward));

    message.reply({ embeds: [new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
        .setTitle('Daily Rewards')
        .setColor('GREEN')
        .setDescription(`${emotes.kr}${comma(reward)} has been placed in your wallet`)
        .setFooter(footer)], failIfNotExists: false });
}

// eslint-disable-next-line no-unused-vars
function msToTime(duration) {
    /* eslint-disable-next-line no-unused-vars */
    let milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;

    return `${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;
}

export default db;
