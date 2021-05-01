const pack = require('krunker-skin-pack');
const data = require('../data');

for (const [key, v] of (Object.entries(pack)))
    module.exports[key] = v;


module.exports.emoteColorParse = (index) => {
    const res = [`${data.emotes.uncommon}`, `${data.emotes.rare}`, `${data.emotes.epic}`, `${data.emotes.legendary}`, `${data.emotes.relic}`, `${data.emotes.contraband}`, `${data.emotes.unobtainable}`][index];
    if (res)
        return res;
    else
        return 'Spray';
};
