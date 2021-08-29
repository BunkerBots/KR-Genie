import Skins from './skins.js';


/**
 * 0 - uncommon
 * 1 - rare
 * 2 - epic
 * 3 - legendary
 * 4 - relic
 * 5 - contraband
 * 6 - unobtainable
 */
const { sorted } = Skins;
const heroicSpin = () => {
    const rarity = Math.floor(Math.random() * 10000);
    if (rarity <= 10)
        return sorted[6][Math.floor(Math.random() * sorted[6].length)];
    else if (rarity <= 200)
        return sorted[5][Math.floor(Math.random() * sorted[5].length)];
    else if (rarity <= 490)
        return sorted[4][Math.floor(Math.random() * sorted[4].length)];
    else if (rarity <= 1500)
        return sorted[3][Math.floor(Math.random() * sorted[3].length)];
    else if (rarity <= 2200)
        return sorted[2][Math.floor(Math.random() * sorted[2].length)];
    else if (rarity <= 10000)
        return sorted[1][Math.floor(Math.random() * sorted[1].length)];
};

const eliteSpin = () => {
    const rarity = Math.floor(Math.random() * 100);
    if (rarity >= 0 && rarity <= 5)
        return sorted[3][Math.floor(Math.random() * sorted[3].length)];
    else if (rarity > 5 && rarity <= 20)
        return sorted[2][Math.floor(Math.random() * sorted[2].length)];
    else if (rarity > 20 && rarity <= 50)
        return sorted[1][Math.floor(Math.random() * sorted[1].length)];
    else if (rarity > 50 && rarity <= 100)
        return sorted[0][Math.floor(Math.random() * sorted[0].length)];
};

const starterSpin = () => {
    const rarity = Math.floor(Math.random() * 100);
    if (rarity >= 0 && rarity <= 13)
        return sorted[2][Math.floor(Math.random() * sorted[2].length)];
    else if (rarity > 13 && rarity <= 35)
        return sorted[1][Math.floor(Math.random() * sorted[1].length)];
    else if (rarity > 35 && rarity <= 100)
        return sorted[0][Math.floor(Math.random() * sorted[0].length)];
};

export {
    heroicSpin,
    eliteSpin,
    starterSpin
};
