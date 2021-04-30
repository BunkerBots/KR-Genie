const Keyv = require('@keyvhq/keyv');
const KeyvRedis = require('@keyvhq/keyv-redis');
require('dotenv').config();
const store = new KeyvRedis(process.env.REDIS_URL);
const keyv = new Keyv({
    store,
});
const promisify = require('pify');
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

    async* iterator() {
        const scan = promisify(this.keyv.options.store.redis.scan).bind(this.keyv.options.store.redis);

        async function * iterate(curs, pattern) {
            const [cursor, keys] = await scan(curs, 'MATCH', pattern);
            for (const key of keys) yield key.split(':')[1];
            if (cursor !== '0') yield * iterate(cursor, pattern);
        }

        yield * iterate(0, `${this.keyv.options.namespace}:*`);
    }

    async values() {
        const iterator = await this.iterator();
        const keyPromise = [];
        for await (const key of iterator)
            keyPromise.push(await this.keyv.get(key));
        const keys = await Promise.all(keyPromise);
        return keys;
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
                balance: {
                    wallet: 0,
                    bank: 0,
                },
                inventory: {
                    skins: [],
                    items: [],
                    collectables: [],
                },
                krunkitis: false,
                premium: false,
                verified: false,
                alphaTester: false,
                notifications: false,
                banned: false,
            };
        }
        return val;
    }

    async addKR(id, kr) {
        return this.get(id).then(value => {
            value.balance.wallet += Number(kr);
            return this.keyv.set(id, value).then(x => x ? value.balance.wallet : 0);
        });
    }

    async krunkitis(id) {
        return this.get(id).then(x => x.krunkitis);
    }

    async infect(id) {
        return this.get(id).then(async x => {
            x.krunkitis = true;
            await this.keyv.set(id, x);
            return x.krunkitis;
        });
    }

    async cure(id) {
        return this.get(id).then(async x => {
            x.krunkitis = false;
            await this.keyv.set(id, x);
            return x.krunkitis;
        });
    }

    async premium(id) {
        return this.get(id).then(x => x.premium);
    }

    async getPremium(id) {
        return this.get(id).then(async x => {
            x.premium = true;
            await this.keyv.set(id, x);
            return x.premium;
        });
    }

    async removePremium(id) {
        return this.get(id).then(async x => {
            x.premium = false,
            await this.keyv.set(id, x);
            return x.premium;
        });
    }


    async verified(id) {
        return this.get(id).then(x => x.verified);
    }

    async verify(id) {
        return this.get(id).then(async x => {
            x.verified = true;
            await this.keyv.set(id, x);
            return x.verified;
        });
    }

    async unverify(id) {
        return this.get(id).then(async x => {
            x.verified = false;
            await this.keyv.set(id, x);
            return x.verified;
        });
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

    async skinInventory(id) {
        return this.get(id).then(x => x.inventory.skins);
    }

    async addSkin(id, skin) {
        return this.get(id).then(async x => {
            if (skin instanceof Array) x.inventory.skins = x.inventory.skins.concat(skin);
            else x.inventory.skins.push(skin);
            await this.keyv.set(id, x);
            return x.inventory.skins;
        });
    }

    async itemInventory(id) {
        return this.get(id).then(x => x.inventory.items);
    }

    async addItem(id, item) {
        return this.get(id).then(async x => {
            if (item instanceof Array) x.inventory.items = x.inventory.items.concat(item);
            else x.inventory.items.push(item);
            await this.keyv.set(id, x);
            return x.inventory.items;
        });
    }

    async collectablesInventory(id) {
        return this.get(id).then(x => x.inventory.collectables);
    }

    async addCollectable(id, collectable) {
        return this.get(id).then(async x => {
            if (collectable instanceof Array) x.inventory.collectables = x.inventory.collectables.concat(collectable);
            else x.inventory.collectables.push(collectable);
            await this.keyv.set(id, x);
            return x.inventory.collectables;
        });
    }

    async notifications(id) {
        return this.get(id).then(x => x.notifications);
    }

    async disableNotifications(id) {
        return this.get(id).then(async x => {
            x.notifications = false;
            await this.keyv.set(id, x);
            return x.notifications;
        });
    }

    async enableNotifications(id) {
        return this.get(id).then(async x => {
            x.notifications = true;
            await this.keyv.set(id, x);
            return x.notifications;
        });
    }

    async banned(id) {
        return this.get(id).then(x => x.banned);
    }

    async ban(id) {
        return this.get(id).then(async x => {
            x.banned = true;
            await this.keyv.set(id, x);
            return x.banned;
        });
    }

    async unban(id) {
        return this.get(id).then(async x => {
            x.banned = false;
            await this.keyv.set(id, x);
            return x.banned;
        });
    }


}
const client = new DBClient;
const bench = {};
if (process.env.BENCHMARK) {
    console.debug('ENABLING BENCHMARKS!');
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
    console.debug('Benchmarks: ', bench);
} else
    module.exports = client;

module.exports.bench = bench;
