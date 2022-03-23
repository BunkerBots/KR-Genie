import DBClient from './Db.js';
import type { Economy as IE } from '../../types/Database';
import type { User, inventoryTypes, statsTypes, preferencesTypes } from '../../types/User';

interface DB extends IE { };

class DB extends DBClient {

    constructor() {
        super('economy');
        this.state = this;
    }

    async get(id: string) {
        let val = (await this.keyv.get(id) as User | null | undefined);
        if (!val) {
            val = {
                id,
                balance: {
                    wallet: 0,
                    bank: {
                        balance: 0,
                        limit: 10000
                    },
                },
                inventory: {
                    skins: [],
                    items: [],
                    collectables: [],
                },
                stats: {
                    xp: 0,
                    level: 0,
                    spins: 0,
                    krunkitis: false,
                    premium: false,
                    verified: false,
                    alphaTester: false,
                    trades: []
                },
                preferences: {
                    notifications: false
                },
                banned: false,
            };
        }

        return val;
    }


    async addKR_wallet(id: string, kr: number) {
        const res = await this.get(id);
        res.balance.wallet += Number(kr);
        this.keyv.set(id, res);
        return res.balance.wallet;
    }

    async addKR_bank(id: string, kr: number) {
        const res = await this.get(id);
        res.balance.bank.balance += Number(kr);
        this.keyv.set(id, res);
        return res.balance.bank.balance;
    }


    async incrementSpins(id: string, count?: number) {
        const res = await this.get(id)
        res.stats.spins += count ? Number(count) : 1;
        await this.keyv.set(id, res);
        return res.stats.spins;
    }


    async infect(id: string) {
        const res = await this.get(id);
        res.stats.krunkitis = true;
        this.keyv.set(id, res);
        return true;
    }

    async cure(id: string) {
        const res = await this.get(id);
        res.stats.krunkitis = false;
        this.keyv.set(id, res);
        return false;
    }


    async addPremium(id: string) {
        const res = await this.get(id);
        res.stats.premium = true;
        this.keyv.set(id, res);
        return true;
    }

    async removePremium(id: string) {
        const res = await this.get(id);
        res.stats.premium = false;
        this.keyv.set(id, res);
        return false;
    }


    async verify(id: string) {
        const res = await this.get(id);
        res.stats.verified = true;
        this.keyv.set(id, res);
        return true;
    }

    async unVerify(id: string) {
        const res = await this.get(id);
        res.stats.verified = false;
        this.keyv.set(id, res);
        return false;
    }

    async balance(id: string) {
        return (await this.get(id)).balance;
    }

    async deposit(id: string, amount: number) {
        const res = await this.get(id);
        res.balance.wallet -= amount;
        res.balance.bank.balance += amount;
        await this.keyv.set(id, res);
        return res.balance.bank.balance;
    }

    async withdraw(id: string, amount: number) {
        const res = await this.get(id);
        res.balance.wallet += amount;
        res.balance.bank.balance -= amount;
        await this.keyv.set(id, res);
        return res.balance.bank.balance;

    }

    async getStats(id: string, type: statsTypes) {
        const res = await this.get(id);
        return type ? res.stats[type] : res.stats;
    }

    async getInventory(id: string, type: inventoryTypes) {
        return (await this.get(id)).inventory[type];
    }

    async addToInventory(id: string, element: any, type: inventoryTypes) {
        const res = await this.get(id);
        if (element instanceof Array)
            res.inventory[type] = [...element, ...res.inventory[type]];
        else res.inventory[type].push(element);

        return res.inventory[type];
    }

    
    async removeFromInventory(id: string, index: number, type: inventoryTypes) {
        const res = await this.get(id);
        res.inventory[type].splice(index, 1);
        await this.keyv.set(id, res);
        return res.inventory[type];
    }

    async resetInventory(id: string, type?: inventoryTypes) {
        const res = await this.get(id);
        if (type)
            res.inventory[type] = [];
        else {
            res.inventory = {
                collectables: [],
                skins: [],
                items: []
            }
        }

        await this.keyv.set(id, res);
        return res.inventory;
    }


    async getPreferences(id: string, type?: preferencesTypes) {
        const res = await this.get(id);
        return type ? res.preferences[type] : res.preferences;
    }

    async setPreferences(id: string, value: any, type: preferencesTypes) {
        const res = await this.get(id);
        res.preferences[type] = value;
        await this.keyv.set(id, res);
        return res.preferences[type];
    }


    async banned(id: string) {
        return this.get(id).then(x => x.banned);
    }

    async ban(id: string) {
        return this.get(id).then(async x => {
            x.banned = true;
            await this.keyv.set(id, x);
            return x.banned;
        });
    }

    async unban(id: string) {
        return this.get(id).then(async x => {
            x.banned = false;
            await this.keyv.set(id, x);
            return x.banned;
        });
    }


    async addTrade(id: string, trade: any) {
        return this.get(id).then(async x => {
            if (trade instanceof Array) x.stats.trades = x.stats.trades.concat(trade);
            else x.stats.trades.push(trade);
            await this.keyv.set(id, x);
            return x.stats.trades;
        });
    }

    async removeTrade(id: string, index: number) {
        return this.get(id).then(async x => {
            x.stats.trades.splice(index, 1);
            await this.keyv.set(id, x);
            return x.stats.trades;
        });
    }

    async getTradeID(id: string) {
        return this.get(id).then(async x => {
            if (x.stats.trades.length === 0) return 0;
            // @ts-ignore
            else return x.stats.trades[x.stats.trades.length - 1].tradeID;
        });
    }

}

export default DB;
