const mongo = require('./mongo');
const schema = require('./schema');

const getNeededXP = (level) => level * level * 100;

const addXP = async(userId, xpToAdd, message) => {
    await mongo().then(async() => {
        try {
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

            if (xp >= needed) {
                ++level;
                xp -= needed;

                message.reply(
                    `You are now level ${level} with ${xp} experience! You now need ${getNeededXP(
                        level,
                    )} XP to level up again.`,
                );

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
