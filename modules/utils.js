const Skins = require('./skins'),
    db = require('../modules'),
    items = require('../data/items');
const getRandomRaritySkin = () => {
    const rarity = Math.floor(Math.random() * 10000);
    if (rarity <= 10)
        return Skins.sorted[6][Math.floor(Math.random() * Skins.sorted[6].length)];
    else if (rarity <= 200)
        return Skins.sorted[5][Math.floor(Math.random() * Skins.sorted[5].length)];
    else if (rarity <= 490)
        return Skins.sorted[4][Math.floor(Math.random() * Skins.sorted[4].length)];
    else if (rarity <= 1500)
        return Skins.sorted[3][Math.floor(Math.random() * Skins.sorted[3].length)];
    else if (rarity <= 2200)
        return Skins.sorted[2][Math.floor(Math.random() * Skins.sorted[2].length)];
    else if (rarity <= 10000)
        return Skins.sorted[1][Math.floor(Math.random() * Skins.sorted[1].length)];
};

module.exports = {
    getRandomRaritySkin,
};

module.exports.useItem = async(id, item) => {
    const user = await db.utils.get(id);
    const arg = item.toLowerCase();
    const foundSkin = await items.items.find(x => x.name.toLowerCase() == arg);
    const index = user.inventory.items.findIndex(x => x === foundSkin.id);
    user.inventory.items.splice(index, 1);
    await db.set(id, user);
    console.log(index);
};

module.exports.findItem = async(id, item) => {
    const user = await db.utils.get(id);
    const arg = item.toLowerCase();
    const foundSkin = await items.items.find(x => x.name.toLowerCase() == arg);
    if (foundSkin == undefined) return undefined;
    const index = user.inventory.items.findIndex(x => x === foundSkin.id);

    if (index == -1) // If skin not found
        return undefined;
    return index;
};

const aliases = [['uncommon? idk', 'fill this']];

module.exports.resolveRarity = (str) => {
    for (const i in aliases)
        if (aliases[i].includes(str.toLowerCase())) return i;
};

