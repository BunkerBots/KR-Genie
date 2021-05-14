import { Schema, model } from 'mongoose';

const reqString = {
    type: String,
    required: true,
};

const levels = Schema({
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

export default model('levels', levels);
