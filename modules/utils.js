const Skins = require('./skins');
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
