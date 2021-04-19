const Schema = require('./Schema');

const User = new Schema({
    userID: {
        type: String,
        required: true,
    },
    KR: {
        type: Number,
        default: 0,
    },
    KRbank: {
        type: Number,
        default: 0,
    },
    skinInventory: {
        type: [Object],
        default: [],
    },
});

module.exports = User;
