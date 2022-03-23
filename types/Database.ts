import keyv from '@keyvhq/core';

interface DBClient {
    keyv: keyv<unknown>;
    set: keyv<unknown>['set'];
    delete: keyv<unknown>['delete'];
    clear: keyv<unknown>['clear'];
    iterator: keyv<unknown>['iterator'];
    utils?: unknown;
}


interface Economy extends DBClient {
    keyv: keyv<unknown>;
    state: Economy
}

export type { DBClient, Economy };
