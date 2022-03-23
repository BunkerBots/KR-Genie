import { config } from 'dotenv';
config();

import Keyv from '@keyvhq/core';
import { MessageAttachment, Message } from 'discord.js';
import KeyvMongo from '@keyvhq/mongo';
import type { DBClient as IDBC } from '../../types/Database';


interface DBClient extends IDBC { };


class DBClient {

    constructor(collection: string) {
        const store = new KeyvMongo(process.env.MONGO_URL, {
            collection: collection
        });

        const keyv = new Keyv({
            store
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
        // @ts-ignore
        for await (const [, value] of iterator)
            values.push(value);
        return values;
    }

    async backup(channel: Message<boolean>['channel']) {
        const values = await this.values();
        channel.send({ files: [new MessageAttachment(Buffer.from(JSON.stringify(values, null, 5)), `BACKUP_${new Date()}.json`)] });
    }

}

export default DBClient;
