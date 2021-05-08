/* eslint-disable prefer-const */
const { MessageEmbed } = require('discord.js');
const mongo = require('./mongo'),
    schema = require('./schema'),
    db = require('../modules'),
    emotes = require('../data').emotes,
    dailyRewardsSchema = require('./daily-rewards-schema'),
    comma = require('../modules/comma');

const getNeededXP = (level) => level * level * 100;
const levelReward = (level) => level * 1000;
const addXP = async(userId, xpToAdd, message) => {
    await mongo().then(async() => {
        try {
            const res = await schema.findOne({ userId });
            if (!res) {
                await new schema({
                    userId,
                    xp: 0,
                    level: 1,
                }).save();
            }
            const result = await schema.findOneAndUpdate(
                {
                    userId,
                },
                {
                    userId,
                    $inc: {
                        xp: xpToAdd,
                    },
                },
                {
                    upsert: true,
                    new: true,
                },
            );

            let { xp, level } = result;
            const needed = getNeededXP(level);
            const reward = levelReward(level);
            if (xp >= needed) {
                ++level;
                xp -= needed;

                message.reply(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                    .setColor('GREEN')
                    .setDescription(`You leveled up! \`${level - 1} => ${level}\` with \`${xp}\` experience! As a reward ${emotes.kr}${parseInt(reward)} has been placed in your wallet!`)
                    .setTimestamp());
                await db.utils.addKR(userId, parseInt(reward));

                await schema.updateOne(
                    {
                        userId,
                    },
                    {
                        level,
                        xp,
                    },
                );
            }
        } catch (e) {
            console.log(e);
        }
    });
};

module.exports.addXP = addXP;

module.exports.getXP = async(userId) => {
    return await mongo().then(async() => {
        try {
            const res = await schema.findOne({ userId });
            if (!res) {
                await new schema({
                    userId,
                    xp: 0,
                    level: 1,
                }).save();
            }
            const result = await schema.findOne(
                { userId },
            );
            const { xp, level } = result;
            const needed = getNeededXP(level);
            return [xp, needed];
        } catch (error) {
            console.log(error);
        }
    });
};

module.exports.getLevel = async(userId) => {
    return await mongo().then(async() => {
        try {
            const res = await schema.findOne({ userId });
            if (!res) {
                await new schema({
                    userId,
                    xp: 0,
                    level: 1,
                }).save();
            }
            const result = await schema.findOne(
                { userId },
            );
            const { level } = result;
            return level;
        } catch (error) {
            console.log(error);
        }
    });
};

module.exports.dailyRewards = async(userId, message) => {
    const obj = {
        userId: userId,
    };
    let reward = 2500;
    let footer = '';
    const verified = await db.utils.verified(userId);
    const premium = await db.utils.premium(userId);
    if (verified == true) reward = 3000, footer = 'premium perks + 1500 KR reward';
    if (premium == true) reward = 4000, footer = 'verified perks + 2500 KR reward';
    await mongo().then(async() => {
        try {
            const result = await dailyRewardsSchema.findOne(obj);
            if (result) {
                const then = new Date(result.updatedAt).getTime();
                const now = new Date().getTime();
                const diffTime = Math.abs(now - then);
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                const t = parseInt(now - then); // without abs
                if (diffDays < 1) {
                    console.log(diffTime);
                    const x = msToTime(parseInt(86400000 - t));
                    console.log(x);
                    message.reply(new MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                        .setTitle('Daily')
                        .setColor('RED')
                        .setDescription('You\'ve already claimed your daily today'));
                    return;
                }
            }

            await dailyRewardsSchema.findOneAndUpdate(obj, obj, {
                upsert: true,
            });

            await db.utils.addKR(userId, parseInt(reward));
            // TODO: Give the rewards
            message.reply(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle('Daily Rewards')
                .setColor('GREEN')
                .setDescription(`${emotes.kr}${comma(reward)} has been placed in your wallet`)
                .setFooter(footer));
        } catch (e) {
            console.log(e);
        }
    });
};

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
