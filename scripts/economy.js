/* eslint-disable no-empty-function */
const Keyv = require('@keyvhq/keyv');
const KeyvRedis = require('@keyvhq/keyv-redis');

require('dotenv').config();
const store = new KeyvRedis(process.env.REDIS_URL);
const keyv = new Keyv({
    store,
    namespace: 'users',
    serialize: () => {},
    deserialize: () => {},
});
class DBClient {

    constructor() {
        this.keyv = keyv;
        return this;
    }

    async addKR(id, kr) {
        const value = await this.get(id);
        console.log(value)
        value.balance.wallet += Number(kr);
        await this.keyv.set(id, value);
        return value.balance.wallet;
    }

    async get(id) {
        let val = await this.keyv.get(id);
        if (!val) {
            val = {
                id,
                balance: {
                    wallet: 0,
                    bank: 0,
                },
                inventory: {
                    skins: [],
                },
            };
        }
        return val;
    }

    async balance(id) {
        return this.get(id).then(x => x.balance);
    }

    async deposit(id, amount) {
        return this.get(id).then(x => {
            x.balance.wallet -= amount;
            x.balance.bank += amount;
            return x.balance.bank;
        });
    }

    async removeAcc(id) {
        return this.keyv.delete(id);
    }

    async addSkin(id, skin) {
        return this.get(id).then(x => {
            x.inventory.skins.push(skin);
            this.keyv.set(id, x);
            return x.inventory.skins;
        });
    }

    async skinInventory(id) {
        return this.get(id).then(x => x.inventory.skins);
    }

}
const client = new DBClient;

const bench = {};
if (process.env.BENCHMARK) {
    console.log('ENABLING BENCHMARKS!');
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(client)).filter(x => x != 'constructor')) {
        bench[key] = [];
        module.exports[key] = async() => {
            const start = process.hrtime();
            const val = await client[key](arguments);
            const time = process.hrtime(start);
            const arr = bench[key];
            arr.push(time[0] + (time[1] / 1e9));
            bench[key] = arr;
            return val;
        };
    }
    console.log(bench);
}
module.exports.bench = bench;
