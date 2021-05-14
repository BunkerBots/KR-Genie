import { Schema, model } from 'mongoose';

const reqString = {
    type: String,
    required: true,
};

const dailyRewardsSchema = Schema(
    {
        userId: reqString,
    },
    {
        timestamps: true,
    },
);

export default model('daily-rewards', dailyRewardsSchema);
