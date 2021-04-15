const profileSchema = require('../schemas/profile-schema');
const mongoose = require('mongoose')
require('dotenv').config()

module.exports.addKR = async (userID, KR) => {
    return await mongoose.connect(process.env.mongoPath, {
        
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
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
            return result.KR
        } catch (e) {
            console.log(e)
        }
    })

}

module.exports.balance = async (userID) => {

    return await mongoose.connect(process.env.mongoPath, {
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
                    KR,
                    KRbank
                }).save()
            }

            return KR
        } catch (e) {
            console.log(e)
        }
    })
}

module.exports.bankBalance = async (userID) => {

    return await mongoose.connect(process.env.mongoPath, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(async (mongoose) => {
        try {
            const result = await profileSchema.findOne({ userID })
            let KRbank = 0
            if (result) {
                KRbank = result.KRbank
            } else {
                await new profileSchema({
                    userID,
                    KR,
                    KRbank
                }).save()
            }
            return KRbank
        } catch (e) {
            console.log(e)
        }
    })
}

module.exports.deposit = async (userID, KRbank) => {
    return await mongoose.connect(process.env.mongoPath, {
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
                    KRbank,
                },
            },
            
            {
                upsert: true,
                new: true,
            })
            return result.KRbank
        } catch (e) {
            console.log(e)
        }
    })

}

module.exports.removeAcc = async (userID) => {
    return await mongoose.connect(process.env.mongoPath, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    }).then(async (mongoose) => {
        try {
            await profileSchema.findOneAndDelete({
                userID
            })
        } catch (e) {
            console.log(e)
        }
    })

}