// import Skins from './skins.js';
// import db from '../modules/db/economy.js';
// import { items as _items } from '../data/items.js';
import { ButtonInteraction, ColorResolvable, CommandInteraction, EmbedAuthorData, Interaction, Message, MessageEmbed, SelectMenuInteraction, User } from 'discord.js';
import { Message as IMessage, embedPayload } from '../types/Message';



// const { sorted } = Skins;
// const getRandomRaritySkin = () => {
//     const rarity = Math.floor(Math.random() * 10000);
//     if (rarity <= 10)
//         return sorted[6][Math.floor(Math.random() * sorted[6].length)];
//     else if (rarity <= 200)
//         return sorted[5][Math.floor(Math.random() * sorted[5].length)];
//     else if (rarity <= 490)
//         return sorted[4][Math.floor(Math.random() * sorted[4].length)];
//     else if (rarity <= 1500)
//         return sorted[3][Math.floor(Math.random() * sorted[3].length)];
//     else if (rarity <= 2200)
//         return sorted[2][Math.floor(Math.random() * sorted[2].length)];
//     else if (rarity <= 10000)
//         return sorted[1][Math.floor(Math.random() * sorted[1].length)];
// };

// export default {
//     getRandomRaritySkin,
// };

// export async function useItem(id, item) {
//     const user = await db.utils.get(id);
//     const arg = item.toLowerCase();
//     const foundSkin = await _items.find(x => x.name.toLowerCase() == arg);
//     const index = user.inventory.items.findIndex(x => x === foundSkin.id);
//     user.inventory.items.splice(index, 1);
//     await db.set(id, user);
//     console.log(index);
// }

// export async function findItem(id, item) {
//     const user = await db.utils.get(id);
//     const arg = item.toLowerCase();
//     const foundSkin = await _items.find(x => x.name.toLowerCase() == arg);
//     if (foundSkin == undefined) return undefined;
//     const index = user.inventory.items.findIndex(x => x === foundSkin.id);

//     if (index == -1) // If skin not found
//         return undefined;
//     return index;
// }

// const aliases = [['uncommon', 'uncommons'], ['rare', 'rares'], ['epic', 'epics'], ['legendary', 'legendaries'], ['relic', 'relics'], ['contraband', 'contrabands', 'contra']];

// export function resolveRarity(str) {
//     const test = str.toLowerCase();
//     for (const i in aliases)
//         if (aliases[i].includes(test)) return i;
//     return undefined;
// }


export function init() {

    const meta = [sendEmbedDM, sendEmbed, replyEmbed, getUser, getMember, disableComponents, createEmbed, handleInteraction];

    for (const data of meta) {
        // @ts-ignore
        Message.prototype[(data.name as string)] = data;
    }

}


async function getMember(this: IMessage, string: string) {
    const member = await this.guild.members.fetch(string.replace(/\D/g, '')).catch(() => { });
    return member ? member : null;
};

async function getUser(this: IMessage, string: string) {
    const user = await this.client.users.fetch(string.replace(/\D/g, '')).catch(() => { });
    return user ? user : null;
};


function disableComponents(this: IMessage) {
    const newRows = this.components.map(row => {
        row.components = row.components.map(component => component?.setDisabled(true));
        return row;
    });
    return this.edit({ components: newRows });
};

function createEmbed({ title, author, description, color, footer, fields, timestamp }: embedPayload) {
    const embed = new MessageEmbed()
        .setDescription(description)
        .setColor(color ? color : 'GOLD');

    if (fields) {
        for (let i = 0; i < fields.length; i++)
            embed.addField(fields[i].name, fields[i].value, fields[i].inline ? true : false);
    }
    title && embed.setTitle(title);
    footer && embed.setFooter({ text: footer });
    author && embed.setAuthor({ name: author.name, iconURL: author.iconURL });
    timestamp && (embed.setTimestamp());
    return embed;
};

async function sendEmbedDM(this: IMessage, { author, description, color, footer, fields }: embedPayload) {
    let msg = null;
    const embed = new MessageEmbed()
        .setDescription(String(description))
        .setColor(color ? color : 'GOLD');

    if (fields) {
        for (let i = 0; i < fields.length; i++)
            embed.addField(fields[i].name, fields[i].value, fields[i].inline ? true : false);
    }
    if (footer) embed.setFooter({ text: footer });
    if (author) embed.setAuthor({ name: author.name, iconURL: author.iconURL });
    try {
        msg = await this.author.send({ embeds: [embed] });
    } catch (e) {
        console.log('error, handling: ' + e);
        this.replyEmbed({ description: 'Unable to send DMs, please open your DMs and try again', color: 'RED' });
        return null;
    }

    return msg;
}

async function sendEmbed(this: IMessage, { author, description, color, footer, fields }: embedPayload) {
    const embed = new MessageEmbed()
        .setDescription(String(description))
        .setColor(color ? color : 'GOLD');

    if (fields) {
        for (let i = 0; i < fields.length; i++)
            embed.addField(fields[i].name, fields[i].value, fields[i].inline ? true : false);
    }
    if (footer) embed.setFooter({ text: footer });
    if (author) embed.setAuthor({ name: author.name, iconURL: author.iconURL });
    return await this.channel.send({ embeds: [embed] }).catch(console.error);
};

async function replyEmbed(this: IMessage, { author, description, color, footer, fields, timestamp }: embedPayload) {
    const embed = new MessageEmbed()
        .setDescription(String(description))
        .setColor(color ? color : 'GOLD');

    if (fields) {
        for (let i = 0; i < fields.length; i++)
            embed.addField(fields[i].name, fields[i].value, fields[i].inline ? true : false);
    }

    if (footer) embed.setFooter({ text: footer });
    if (author) embed.setAuthor({ name: author.name, iconURL: author.iconURL });
    timestamp && embed.setTimestamp();
    return await this.reply({ embeds: [embed], failIfNotExists: false }).catch(console.error);
};

function handleInteraction(this: IMessage, i: CommandInteraction | ButtonInteraction | SelectMenuInteraction, author?: string) {
    const user = author ? author : this.author.id;
    if (i.user.id !== user) {
        i.reply({
            content: `You can't use the controls of a command issued by another user!\n Current Command issued by: <@${user}>`,
            ephemeral: true
        });
        return true;
    }
}

function parseFileName(filename: string) {
    const s = filename.split('\\');
    const p = s[s.length - 1].split('.');
    return p[0];
}


export {
    createEmbed,
    parseFileName
}

