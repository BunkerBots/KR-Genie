import Keyv from '@keyvhq/keyv';
import KeyvMongo from '@keyvhq/keyv-mongo';

import dotenv from 'dotenv';
dotenv.config();


const store = new KeyvMongo(process.env.MONGO_TEST);
const keyv = new Keyv({
    store,
});
keyv.on('error', (...error) => console.error('keyv error: ', ...error));


class DBClient {

    constructor() {
        this.keyv = keyv;

        this.set = this.keyv.set.bind(keyv);
        this.delete = this.keyv.delete.bind(keyv);
        this.clear = this.keyv.clear.bind(keyv);
        this.utils = new DBUtils(this.keyv);
        return this;
    }

}

class DBUtils {

    constructor(optsKeyv) {
        this.keyv = optsKeyv;
        return this;
    }

    async get(id) {
        let val = await this.keyv.get(id);
        if (!val) {
            val = {
                id,
                items: [Object],
            };
        }
        if (!val.items) val.items = [Object];
        return val;
    }

    async listSkin(id, skinInfo) {
        return this.get(id).then(async value => {
            if (skinInfo instanceof Array) value.items = value.items.concat(skinInfo);
            else value.items.push(skinInfo);
            await this.keyv.set(id, value);
            return value.items;
        });
    }

    async getListing(id) {
        return this.get(id).then(x => x.items);
    }

    async getListingID(id) {
        return this.get(id).then(x => {
            if (x.items.length == 0) return 0;
            else return x.items[x.items.length - 1].id;
        });
    }

}
const client = new DBClient;
export default client;
