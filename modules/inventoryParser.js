import Skins from '../modules/skins.js';
import { collectables, items } from '../data/items.js';
import dat from '../data/index.js';
import { MessageEmbed } from 'discord.js';
const { emotes } = dat;

class ParseInventory {

    constructor(arr) {
        this.arr = arr;
        this.dupes = new Map();
    }

    async parseSkins() {
        const skinsarr = [];
        const data = this.arr.map(x => Skins.allSkins[x]).sort((a, b) => a.rarity - b.rarity).reverse()
            .filter(x => {
                const count = this.dupes.get(x.index) || 0;
                this.dupes.set(x.index, count + 1);
                return !count;
            });
        for (const skin of data) {
            const link = Skins.getMarketLink(skin);
            const count = this.dupes.get(skin.index);
            skinsarr.push(`${Skins.emoteColorParse(skin.rarity)} [${skin.name}](${await link})${count == 1 ? '' : ` x ${count}`}`);
        }
        return skinsarr;
    }

    parseCollectables() {
        const collectablesarr = [];
        const data = this.arr.map(x => collectables[x])
            .filter(x => {
                const count = this.dupes.get(x.id) || 0;
                this.dupes.set(x.id, count + 1);
                return !count;
            });
        for (const collectable of data) {
            const count = this.dupes.get(collectable.id);
            collectablesarr.push(`${collectable.icon} ${collectable.name}${count == 1 ? '' : ` x ${count}`}`);
        }
        return collectablesarr;
    }

    parseItems() {
        const itemsarr = [];
        const data = this.arr.map(x => items[x])
            .filter(x => {
                const count = this.dupes.get(x.id) || 0;
                this.dupes.set(x.id, count + 1);
                return !count;
            });
        for (const item of data) {
            const count = this.dupes.get(item.id);
            itemsarr.push(`${item.icon} ${item.name}${count == 1 ? '' : ` x ${count}`}`);
        }
        return itemsarr;
    }

    spinStatus() {
        const res = [[`${emotes.uncommon}`, 'Uncommons'], [`${emotes.rare}`, 'Rares'], [`${emotes.epic}`, 'Epics'], [`${emotes.legendary}`, 'Legendaries'], [`${emotes.relic}`, 'Relics'], [`${emotes.contraband}`, 'Contrabands'], [`${emotes.unobtainable}`, 'Unobtainables']].reverse();
        const rarityArr = [];
        const sortedRarities = [];
        const data = this.arr.map(x => Skins.allSkins[x])
            .filter(x => {
                const count = this.dupes.get(x.index) || 0;
                this.dupes.set(x.index, count + 1);
                return !count;
            });

        for (const skin of data) rarityArr.push({ rarity: skin.rarity });
        for (let i = 0; i < 7; i++) sortedRarities[i] = rarityArr.filter(x => x.rarity == i);
        const embed = new MessageEmbed();
        const reversedArr = sortedRarities.reverse();
        const len = res.length;
        for (let x = 0; x < len; x++) embed.addField(`${res[x][0]} ${res[x][1]}`, `${reversedArr[x].length}` || 0);
        return embed;
    }

}

export default ParseInventory;
