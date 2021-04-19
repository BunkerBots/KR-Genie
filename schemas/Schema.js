class Schema {

    constructor(schemaOpts) {
        for (const value of Object.values(schemaOpts)) {
            // Set defaults
            if (!value.type) value.type == 'number';
            if (!value.default && !value.required) value.default = 0;
            if (value.default !== undefined)
                if (typeof value.default != value.type) throw new Error('Type of default value doesn\'t match!');
        }
        this.keys = Object.keys(schemaOpts);
        this.entries = Object.entries(schemaOpts);
        this._validator = (obj) => {
            for (const [key, value] of obj) {
                if (!this.keys.includes(key)) return `${key} not found in Schema!`;
                if (typeof value != schemaOpts[key].type) return `Expected type: "${schemaOpts[key].type}" but got "${typeof value}": ${value} instead!`;
            }
            const keys = Object.keys(obj);
            if (!this.keys.filter(x => x.required).every(x => keys.includes(x))) return 'Missing required value!';
            return false;
        };

        this.validator = (obj) => !(this.validator(obj));
        this.serialize = (deserObj) => {
            for (const [key, value] of this.entries)
                if (value.default !== undefined && deserObj[key] == undefined) deserObj[key] = value.default;
            if (!this.validator(deserObj)) throw new Error('Failed to serialize!', deserObj);
            return deserObj;
        };

        this.deserialize = (obj) => {
            const invalid = this._validator(obj);
            if (invalid) throw new Error(`Can't deserialize this!\n${invalid}`, obj);
            for (const [key, value] of this.entries)
                if (obj[key] == value.default) obj[key] = undefined;
            return obj;
        };
    }

}

module.exports = Schema;
