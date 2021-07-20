import DBClient from './Db.js';


const client = new DBClient('listing');

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
                tradeID: 1,
            };
        }
        if (!val.items) val.items = [Object];
        if (!val.tradeID) val.tradeID = 1;
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

    async getTradeID(id) {
        return this.get(id).then(x => x.tradeID);
    }

    async incrementTradeID(id) {
        return this.get(id).then(async x => {
            x.tradeID += 1;
            await this.keyv.set(id, x);
            return x.tradeID;
        });
    }

}
client.utils = new DBUtils(client.keyv);

export default client;
