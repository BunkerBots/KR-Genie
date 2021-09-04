import { config } from 'dotenv';
config();

import Keyv from '@keyvhq/keyv';
import { MessageAttachment } from 'discord.js';
import KeyvMongo from '@keyvhq/keyv-mongo';

class DBClient {

    constructor(collection) {
        const store = new KeyvMongo(process.env.MONGO_URL, {
            collection: collection
        });

        const keyv = new Keyv({
            store,
            collection: collection,
        });
        keyv.on('error', (...error) => console.error('keyv error: ', ...error));

        this.keyv = keyv;

        this.set = this.keyv.set.bind(keyv);
        this.delete = this.keyv.delete.bind(keyv);
        this.clear = this.keyv.clear.bind(keyv);
        this.iterator = this.keyv.iterator.bind(keyv);
        return this;
    }

    async values() {
        const iterator = await this.iterator();
        const values = [];
        for await (const [, value] of iterator)
            values.push(value);
        return values;
    }

    async backup(channel) {
        const values = await this.values();
        channel.send({ files: [new MessageAttachment(Buffer.from(JSON.stringify(values, null, 5)), `BACKUP_${new Date()}.json`)] });
    }

}

export default DBClient;
