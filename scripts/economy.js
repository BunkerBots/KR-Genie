const profileSchema = require('../schemas/profile-schema');
const mongoose = require('mongoose')
const KRcache = {}
const config = require('../JSON/config.json')

module.exports.addKR = async (userID, KR) => {
    return await mongoose.connect(config.mongoPath, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(async (mongoose) => {
        try {
            const result = await profileSchema.findOneAndUpdate({
                userID,
            },
            {
                userID,
                $inc: {
                    KR,
                },
            },
            {
                upsert: true,
                new: true,
            })
            KRcache[userID] = result.KR
            return result.KR
        } finally {
            mongoose.connection.close()
        }
    })

}

module.exports.balance = async (userID) => {
    const cachedValue = KRcache[userID]
    if (cachedValue) {
        return cachedValue
    }
    return await mongoose.connect(config.mongoPath, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(async (mongoose) => {
        try {
            const result = await profileSchema.findOne({ userID })
            let KR = 0
            let KRbank = 0
            if (result) {
                KR = result.KR
            } else {
                await new profileSchema({
                    userID,
                    KR
                }).save()
            }
            KRcache[userID] = KR
            return KR
        } finally {
            mongoose.connection.close()
        }
    })
}
