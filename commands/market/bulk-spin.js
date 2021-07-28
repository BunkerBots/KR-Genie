import skinfetcher from '../../modules/skins.js';
import dat from '../../data/index.js';
import { MessageEmbed } from 'discord.js';
import db from '../../modules/db/economy.js';
import utils from '../../modules/utils.js';
import { createEmbed } from '../../modules/messageUtils.js';
import { addXP } from '../../modules/db/levels.js';
import core from '../../data/JSON/core.json';
const { emotes } = dat;


export default {
    name: 'bulkspin',
    aliases: ['bulk', 'bspin'],
    cooldown: 10,
    description: 'Tired of using individual spins? This command will help you to do multiple spins in one go',
    expectedArgs: 'k/bulkspin (number)',
    // slowmode
    execute: async(message, args) => {
        let limit = 10;
        const premium = await db.utils.premium(message.author.id);
        const verified = await db.utils.verified(message.author.id);
        if (verified == true) limit = 15;
        if (premium == true) limit = 20;
        const spinarr = [];
        const rarityarr = [];
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'How many spins are you gonna do..'));
        if (Number.isInteger(parseInt(args[0]))) {
            if (parseInt(args[0]) > parseInt(limit)) return message.channel.send(createEmbed(message.author, 'RED', `You can only do ${limit} bulk spins per use`));
            if (parseInt(args[0]) < 0) return message.channel.send(createEmbed(message.author, 'RED', `${parseInt(args[0])} Skins were removed from your inventory at random!\n:)`));
            if (parseInt(args[0]) == 1 || parseInt(args[0]) == 0) return message.channel.send(createEmbed(message.author, 'RED', 'JUST DO SPIN!!\nSMH...'));
            const KR = parseInt(500 * parseInt(args[0]));
            const { wallet } = await db.utils.balance(message.author.id);
            let recommended;
            const roundedval = parseInt(wallet / 500).toFixed(0);
            if (roundedval <= 0) recommended = 'Just don\'t spin LOL';
            else recommended = `${roundedval} Spins`;
            if (KR > wallet) {
                message.reply(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`You do not have enough ${dat.emotes.kr} to do ${parseInt(args[0])} spins\n\`Recommended: ${recommended}\``));
                return;
            }
            message.channel.send(new MessageEmbed()
                .setDescription(`${dat.emotes.loading} Running ${parseInt(args[0])} spins!`))
                .then(async msg => {
                    const skinToPush = [];
                    const itemToPush = [];
                    for (let i = 0; i < parseInt(args[0]); i++) {
                        const randomSkin = utils.getRandomRaritySkin();
                        if (randomSkin.index == 1659) itemToPush.push(3);
                        else if (randomSkin.index == 944) itemToPush.push(2);
                        else skinToPush.push(randomSkin.index);
                        // skinToPush.push(randomSkin.index);
                        const emote = skinfetcher.emoteColorParse(randomSkin.rarity);
                        rarityarr.push(randomSkin.rarity);
                        spinarr.push(`${emote} ${randomSkin.name}`);
                    }
                    if (skinToPush.length != 0) await db.utils.addSkin(message.author.id, skinToPush);
                    if (itemToPush.length != 0) await db.utils.addItem(message.author.id, itemToPush);
                    await db.utils.addKR(message.author.id, -KR);
                    await db.utils.addSpinCount(message.author.id, parseInt(args[0]));

                    const minimizedEmbed = mapRarity(rarityarr)
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`${parseInt(args[0])} Heroic Spins Result`)
                        .setColor(core.embed)
                        .addField('\u200b', 'React with `↕️` to view the skin names');

                    const embed = new MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`${parseInt(args[0])} Heroic spins`)
                        .setColor(core.embed)
                        .setDescription(spinarr.join('\n\u200b\n'))
                        .setFooter('feeding your laziness ™');
                    message.channel.send(minimizedEmbed).then(async embedmsg => {
                        msg.delete();
                        await embedmsg.react('↕️');
                        const filter = (reaction, user) => {
                            return reaction.emoji.name === '↕️' && user.id === message.author.id;
                        };

                        const collector = embedmsg.createReactionCollector(filter, { time: 60000 });

                        collector.on('collect', () => embedmsg.edit(embed));

                        collector.on('end', () => embedmsg.edit(minimizedEmbed));
                    });

                    addXP(message.author.id, 23, message);
                    //                     if (!dat.staff.includes(message.author.id)) message.timestamps.set(message.author.id, Date.now());
                });
        } else
            return message.reply(createEmbed(message.author, 'RED', `Expected a number and gave me some random \`${args.join(' ')}\``));
    },
};

function mapRarity(rarityArr) {
    const res = [[`${emotes.uncommon}`, 'Uncommons'], [`${emotes.rare}`, 'Rares'], [`${emotes.epic}`, 'Epics'], [`${emotes.legendary}`, 'Legendaries'], [`${emotes.relic}`, 'Relics'], [`${emotes.contraband}`, 'Contrabands'], [`${emotes.unobtainable}`, 'Unobtainables']].reverse();
    const sortedRarities = [];
    for (let i = 0; i < 7; i++) sortedRarities[i] = rarityArr.filter(x => x == i);
    const embed = new MessageEmbed();
    const reversedArr = sortedRarities.reverse();
    const len = res.length;
    for (let x = 0; x < len; x++)
        if (reversedArr[x].length !== 0) embed.addField(`${res[x][0]} ${res[x][1]}`, reversedArr[x].length || 0);
    return embed;
}
