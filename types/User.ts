type balance = {
    wallet: number;
    bank: {
        limit: number;
        balance: number;
    };
}

type inventoryTypes = 'items' | 'skins' | 'collectables';

type statsTypes = 'xp' | 'level' | 'spins' | 'krunkitis' | 'premium' | 'verified' | 'alphaTester' | 'trades';

type preferencesTypes = 'notifications';

type inventory = {
    skins: any[],
    items: any[],
    collectables: any[]
}

type stats = {
    xp: number;
    level: number;
    spins: number;
    krunkitis: boolean;
    premium: boolean;
    verified: boolean;
    alphaTester: boolean;
    trades: any[];
}

type preferences = {
    notifications: boolean;
}

interface User {
    id: string;
    balance: balance;
    inventory: inventory;
    preferences: preferences;
    stats: stats;
    banned: boolean;
}


export type { User, inventoryTypes, statsTypes, preferencesTypes };
