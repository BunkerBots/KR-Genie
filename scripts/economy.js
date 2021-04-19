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
module.exports = new DBClient;
