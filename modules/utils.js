import Skins from './skins.js';
import db from '../modules/db/economy.js';
import { items as _items } from '../data/items.js';

/**
 * old rates
 * 10
 * 200
 * 490
 * 1500
 * 2200
 * 10000
 */

const { sorted } = Skins;
const getRandomRaritySkin = () => {
    const rarity = Math.floor(Math.random() * 10000);
    if (rarity <= 1)
        return sorted[6][Math.floor(Math.random() * sorted[6].length)];
    else if (rarity <= 100)
        return sorted[5][Math.floor(Math.random() * sorted[5].length)];
    else if (rarity <= 249)
        return sorted[4][Math.floor(Math.random() * sorted[4].length)];
    else if (rarity <= 1400)
        return sorted[3][Math.floor(Math.random() * sorted[3].length)];
    else if (rarity <= 3500)
        return sorted[2][Math.floor(Math.random() * sorted[2].length)];
    else if (rarity <= 10000)
        return sorted[1][Math.floor(Math.random() * sorted[1].length)];
};

export default {
    getRandomRaritySkin,
};

export async function useItem(id, item) {
    const user = await db.utils.get(id);
    const arg = item.toLowerCase();
    const foundSkin = await _items.find(x => x.name.toLowerCase() == arg);
    const index = user.inventory.items.findIndex(x => x === foundSkin.id);
    user.inventory.items.splice(index, 1);
    await db.set(id, user);
    console.log(index);
}

export async function findItem(id, item) {
    const user = await db.utils.get(id);
    const arg = item.toLowerCase();
    const foundSkin = await _items.find(x => x.name.toLowerCase() == arg);
    if (foundSkin == undefined) return undefined;
    const index = user.inventory.items.findIndex(x => x === foundSkin.id);

    if (index == -1) // If skin not found
        return undefined;
    return index;
}

const aliases = [['uncommon', 'uncommons'], ['rare', 'rares'], ['epic', 'epics'], ['legendary', 'legendaries'], ['relic', 'relics'], ['contraband', 'contrabands', 'contra']];

export function resolveRarity(str) {
    const test = str.toLowerCase();
    for (const i in aliases)
        if (aliases[i].includes(test)) return i;
    return undefined;
}

