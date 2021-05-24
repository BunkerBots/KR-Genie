import { config } from 'dotenv';
config();

import Keyv from '@keyvhq/keyv';
import { MessageAttachment } from 'discord.js';
import KeyvMongo from '@keyvhq/keyv-mongo';

const store = new KeyvMongo(process.env.MONGO_URL);


class DBClient {

    constructor(collection) {
        const keyv = new Keyv({
            store,
            collection: collection,
        });
        keyv.on('error', (...error) => console.error('keyv error: ', ...error));

        this.keyv = keyv;

        this.set = this.keyv.set.bind(keyv);
        this.delete = this.keyv.delete.bind(keyv);
        this.clear = this.keyv.clear.bind(keyv);
        this.utils = new DBUtils(this.keyv);
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
        channel.send(new MessageAttachment(Buffer.from(JSON.stringify(values)), `BACKUP_${new Date()}.json`));
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
                spins: 0,
                krunkitis: false,
                premium: false,
                verified: false,
                alphaTester: false,
                notifications: false,
                banned: false,
            };
        }
        if (!val.spins) val.spins = 0;
        return val;
    }

    async addKR(id, kr) {
        return this.get(id).then(value => {
            value.balance.wallet += Number(kr);
            return this.keyv.set(id, value).then(x => x ? value.balance.wallet : 0);
        });
    }

    async addKrToBank(id, kr) {
        return this.get(id).then(value => {
            value.balance.bank += Number(kr);
            return this.keyv.set(id, value).then(x => x ? value.balance.wallet : 0);
        });
    }

    async spinCount(id) {
        return this.get(id).then(x => x.spins);
    }

    async addSpinCount(id, count) {
        return this.get(id).then(async x => {
            if (!x.spins) x.spins = 0;
            x.spins += Number(count);
            await this.keyv.set(id, x);
            return x.spins;
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

    async resetInv(id) {
        return this.get(id).then(async x => {
            x.inventory.skins = [];
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

export default DBClient;
