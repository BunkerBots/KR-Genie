/* eslint-disable prefer-const */
import { MessageEmbed } from 'discord.js';
import DBClient from './Db.js';
import economy from './economy.js';
import { emotes } from '../../data/index.js';
import comma from '../comma.js';

const db = new DBClient('vote');

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

export async function rewards(userId, message) {
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
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 12));
        // const t = parseInt(now - then); // without abs
        const canVoteAt = new Date(then + (1000 * 60 * 60 * 12));

        if (diffDays < 1) {
            // console.log(diffTime);
            // const x = msToTime(parseInt(86400000 - t));
            // console.log(x);
            message.reply({ embeds: [new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle('You\'ve already voted')
                .setColor('RED')
                .setDescription(`You can vote again at : \n**${canVoteAt.toLocaleString()}**`)], allowedMentions: { repliedUser: false }, failIfNotExists: false });
            return;
        }
    }

    await db.utils.stamp(userId);
    await economy.utils.addKR(userId, parseInt(reward));

    message.reply({ embeds: [new MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
        .setTitle('Vote')
        .setColor('GREEN')
        .setDescription(`${emotes.kr}${comma(reward)} has been placed in your wallet`)
        .setFooter(footer)], failIfNotExists: false });
}

export default db;
