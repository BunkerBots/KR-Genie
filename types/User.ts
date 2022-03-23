type balance = {
    wallet: number;
    bank: {
        limit: number;
        balance: number;
    };
}

type inventory = {
    skins: any[],
    items: any[],
    collectables: []
}

type stats = {
    xp: number;
    level: number;
    spins: number;
    krunkitis: boolean;
    premium: boolean;
    verified: boolean;
    alphaTester: boolean;
    trades: [];
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


export type { User };
