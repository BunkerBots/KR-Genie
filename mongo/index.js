const mongo = require('./mongo'),
    schema = require('./schema'),
    db = require('../modules'),
    emotes = require('../data').emotes;

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

                message.reply(
                    `You leveled up! \`${level - 1} => ${level}\` with \`${xp}\` experience! As a reward ${emotes.kr}${parseInt(reward)} has been placed in your wallet!`,
                );
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
