import keyv from '@keyvhq/core';

interface DBClient {
    keyv: keyv<unknown>;
    set: keyv<unknown>['set'];
    delete: keyv<unknown>['delete'];
    clear: keyv<unknown>['clear'];
    iterator: keyv<unknown>['iterator'];
}

export type { DBClient };
