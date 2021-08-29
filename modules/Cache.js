class Cache {

    constructor() {
        this.cache = new Object();
    }

    /**
     * Create a new Array
     * @param {String} identifier String to be used as a key for cache generation
     * @returns Array
     */
    create(identifier) {
        this.cache[identifier] = [];
        return this.cache[identifier];
    }

    set(identifier, value) {
        const val = this.cache[identifier];
        if (!val) throw new Error(`Property ${identifier} does not exist in cache`);
        if (value instanceof Array) this.cache[identifier] = [...val, ...value];
        else val.push(value);
        return this.cache[identifier];
    }

    get(identifier) {
        const val = this.cache[identifier];
        if (!val) throw new Error(`Property ${identifier} does not exist in cache`);
        return val;
    }

    delete(identifier, value) {
        const val = this.cache[identifier];
        if (!val) throw new Error(`Property ${identifier} does not exist in cache`);
        if (value instanceof Array) {
            for (const x of value) {
                const index = val.indexOf(x);
                val.splice(index, 1);
            }
            return val;
        } else {
            const index = val.indexOf(value);
            if (index === -1) throw new Error(`${value} does not exist in ${val}`);
            val.splice(index, 1);
            return val;
        }
    }

    /**
     * Returns an Array with first element as the cache tree and second element as the cache element count
     * @returns Array
     */
    tree() {
        return [this.cache, Object.keys(this.cache).length];
    }

}


export default Cache;
