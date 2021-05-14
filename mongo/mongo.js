import mongoose, { connect } from 'mongoose';
require('dotenv').config();

export default async() => {
    await connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    return mongoose;
};
