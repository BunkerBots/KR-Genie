import pack from 'krunker-skin-pack';
import data from '../data/index.js';

const exports = {};
for (const [key, v] of (Object.entries(pack)))
    exports[key] = v;


exports.emoteColorParse = (index) => {
    const res = [`${data.emotes.uncommon}`, `${data.emotes.rare}`, `${data.emotes.epic}`, `${data.emotes.legendary}`, `${data.emotes.relic}`, `${data.emotes.contraband}`, `${data.emotes.unobtainable}`][index];
    if (res)
        return res;
    else
        return 'Spray';
};

export default exports;
