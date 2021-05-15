import { config } from 'dotenv';
config();

import mongoose from 'mongoose';
const { connect } = mongoose;

export default async() => {
    await connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    return mongoose;
};
