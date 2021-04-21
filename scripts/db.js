/* eslint-disable no-empty-function */
const Keyv = require('@keyvhq/keyv');
const KeyvRedis = require('@keyvhq/keyv-redis');

require('dotenv').config();
const store = new KeyvRedis(process.env.REDIS_URL);
const keyv = new Keyv({
    store,
});
keyv.on('error', console.error);

class DBClient {

    constructor() {
        this.keyv = keyv;
        return this;
    }

    async addKR(id, kr) {
        const value = await this.get(id);
        value.balance.wallet += Number(kr);
        await this.keyv.set(id, value);
        return value.balance.wallet;
    }

    async get(id) {
        // console.log('get id', id);
        let val = await this.keyv.get(id);
        // console.log('get', val);
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
        return this.get(id).then(async x => {
            x.balance.wallet -= amount;
            x.balance.bank += amount;
            await this.keyv.set(id, x);
            return x.balance.bank;
        });
    }

    async withdraw(id, amount) {
        return this.get(id).then(async x => {
            x.balance.wallet += amount;
            x.balance.bank -= amount;
            await this.keyv.set(id, x);
            return x.balance.bank;
        });
    }

    async removeAcc(id) {
        return this.keyv.delete(id);
    }

    async addSkin(id, skin) {
        return this.get(id).then(async x => {
            x.inventory.skins.push(skin);
            await this.keyv.set(id, x);
            return x.inventory.skins;
        });
    }

    async skinInventory(id) {
        return this.get(id).then(x => x.inventory.skins);
    }

    async* iterator() {
        const streamer = await this.keyv.options.store.redis.scanStream({
            match: `${this.keyv.options.namespace}:*`,
        });
        const iterator = streamify(streamer, 'data');

        for await (const keys of iterator) {
            for (const key of await keys)
                yield key.split(':').splice(1);
        }
    }

    async values() {
        const iterator = this.iterator();
        const keyPromise = [];
        for await (const key of iterator)
            keyPromise.push(await this.keyv.get(key));
        return await Promise.all(keyPromise);
    }

}

const streamify = function(stream, event) {
    const pullQueue = [];
    const pushQueue = [];
    let done = false;
    const pushValue = async(args) => {
        if (pullQueue.length !== 0) {
            const resolver = pullQueue.shift();
            resolver(...args);
        } else
            pushQueue.push(args);
    };

    const pullValue = () => {
        return new Promise((resolve) => {
            if (pushQueue.length !== 0) {
                const args = pushQueue.shift();
                resolve(...args);
            } else
                pullQueue.push(resolve);
        });
    };

    const handler = (...args) => {
        pushValue(args);
    };

    stream.on(event, handler);
    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        next: () => ({
            done,
            value: done ? undefined : pullValue(),
        }),
        return: () => {
            done = true;
            stream.removeEventListener(event, handler);
            return { done };
        },
        throw: (error) => {
            done = true;
            return {
                done,
                value: Promise.reject(error),
            };
        },
    };
};
const client = new DBClient;
const bench = {};
if (process.env.BENCHMARK) {
    console.log('ENABLING BENCHMARKS!');
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(client)).filter(x => x != 'constructor')) {
        bench[key] = [];
        module.exports[key] = async(...args) => {
            const start = process.hrtime();
            const val = await client[key](...args);
            const time = process.hrtime(start);
            const arr = bench[key];
            arr.push(time[0] + (time[1] / 1e9));
            bench[key] = arr;
            return val;
        };
    }
    console.log(bench);
} else
    module.exports = client;
module.exports.bench = bench;
