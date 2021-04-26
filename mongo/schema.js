const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const levels = mongoose.Schema({
    userId: reqString,
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 1,
    },
});

module.exports = mongoose.model('levels', levels);
