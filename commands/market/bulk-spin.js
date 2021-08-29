import skinfetcher from '../../modules/skins.js';
import dat from '../../data/index.js';
import { MessageActionRow, MessageEmbed, MessageSelectMenu, MessageButton } from 'discord.js';
import db from '../../modules/db/economy.js';
import utils from '../../modules/utils.js';
import { createEmbed, disableComponents } from '../../modules/messageUtils.js';
import { addXP } from '../../modules/db/levels.js';
import core from '../../data/JSON/core.json';
import { starterSpin, eliteSpin } from '../../modules/spins.js';
const { emotes } = dat;

const menuOptions = [{
    label: 'Heroic',
    description: 'Heroic spin',
    value: 'heroic',
},
{
    label: 'Elite',
    description: 'Elite spin',
    value: 'elite',
},
{
    label: 'Starter',
    description: 'Starter spin',
    value: 'starter',
}];


export default {
    name: 'bulkspin',
    aliases: ['bulk', 'bspin'],
    cooldown: 20,
    description: 'Tired of using individual spins? This command will help you to do multiple spins in one go',
    expectedArgs: 'k/bulkspin (number)',
    // slowmode
    execute: async(message, args) => {
        let limit = 10;
        const premium = await db.utils.premium(message.author.id);
        const verified = await db.utils.verified(message.author.id);
        if (verified == true) limit = 15;
        if (premium == true) limit = 20;

        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'How many spins are you gonna do..'));
        if (Number.isInteger(parseInt(args[0])) && args.length < 2) {
            const menuEmbed = new MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.avatarURL({ dynamic: true }))
                .setTitle('Spin menu')
                .setDescription('We currently have `three` types of spins with different chances! please pick one from the drop down menu')
                .addField('Starter', '```⬩ 50 KR\n⬩ Maximum rarity - Epic```', true)
                .addField('Elite', '```⬩ 150 KR\n⬩ Maximum rarity - Legendary```', true)
                .addField('Heroic', '```⬩ 500 KR\n⬩ Maximum rarity - Unobtainable```', true)
                .setColor(core.embed)
                .setTimestamp();


            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('inventory')
                        .setMaxValues(1)
                        .setPlaceholder('Select a category')
                        .addOptions(menuOptions),
                );

            const menu = await message.reply({ components: [row], embeds: [menuEmbed] });

            const filter = i => i.user.id === message.author.id;
            const collector = message.channel.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 60000 });

            collector.on('collect', async i => {
                Spin(i.values[0]);
                menu.delete();
                collector.stop();
            });

            collector.on('end', (i) => { if (i.reason == 'time') disableComponents(menu); });
        } else if (Number.isInteger(parseInt(args[0])) && args[1]) {
            if (!['heroic', 'starter', 'elite'].includes(args[1].toLowerCase())) return message.reply(createEmbed(message.author, 'RED', 'That\'s not a valid spin mate'));
            Spin(args[1].toLowerCase());
        } else
            return message.reply(createEmbed(message.author, 'RED', `Expected a number and gave me some random \`${args.join(' ')}\``));


        async function Spin(spin) {
            let amount, func, type;
            if (spin == 'heroic') amount = 500, func = utils.getRandomRaritySkin, type = 'Heroic';
            else if (spin == 'starter') amount = 50, func = starterSpin, type = 'Starter';
            else if (spin == 'elite') amount = 150, func = eliteSpin, type = 'Elite';
            const spinarr = [];
            const rarityarr = [];
            if (parseInt(args[0]) > parseInt(limit)) return message.channel.send(createEmbed(message.author, 'RED', `You can only do ${limit} bulk spins per use`));
            if (parseInt(args[0]) < 0) return message.channel.send(createEmbed(message.author, 'RED', `${parseInt(args[0])} Skins were removed from your inventory at random!\n:)`));
            if (parseInt(args[0]) == 1 || parseInt(args[0]) == 0) return message.channel.send(createEmbed(message.author, 'RED', 'JUST DO SPIN!!\nSMH...'));
            const KR = parseInt(amount * parseInt(args[0]));
            const { wallet } = await db.utils.balance(message.author.id);
            let recommended;
            const roundedval = parseInt(wallet / 500).toFixed(0);
            if (roundedval <= 0) recommended = 'Just don\'t spin LOL';
            else recommended = `${roundedval} Spins`;
            if (KR > wallet) {
                message.reply({ embeds: [new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`You do not have enough ${dat.emotes.kr} to do ${parseInt(args[0])} ${type} spins\n\`Recommended: ${recommended}\``)] });
                return;
            }
            message.channel.send({ embeds: [new MessageEmbed()
                .setDescription(`${dat.emotes.loading} Running ${parseInt(args[0])} spins!`)] })
                .then(async msg => {
                    const skinToPush = [];
                    const itemToPush = [];
                    for (let i = 0; i < parseInt(args[0]); i++) {
                        const randomSkin = func();
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
                        .setTitle(`${parseInt(args[0])} ${type} Spins Result`)
                        .setColor(core.embed)
                        .addField('\u200b', 'Press the button to view the skin names');
                    const maximizeRow = new MessageActionRow()
                        .addComponents(new MessageButton().setLabel('Maximize').setStyle('SUCCESS').setCustomId('maximize'));
                    const minimizeRow = new MessageActionRow()
                        .addComponents(new MessageButton().setLabel('Minimize').setStyle('SUCCESS').setCustomId('minimize'));

                    const embed = new MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`${parseInt(args[0])} Heroic spins`)
                        .setColor(core.embed)
                        .setDescription(`${spinarr.join('\n\u200b\n')}`)
                        .setFooter('feeding your laziness ™');
                    message.reply({ embeds: [minimizedEmbed], components: [maximizeRow] }).then(async embedmsg => {
                        msg.delete();
                        // await embedmsg.react('↕️');
                        const filter = i => i.user.id === message.author.id;
                        const collector = message.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 60000 });

                        collector.on('collect', async i => {
                            // if (i.user.id !== message.author.id) return i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
                            console.log(i.user.id, message.author.id);
                            if (i.customId === 'maximize')
                                await i.update({ embeds: [embed], components: [minimizeRow] });
                            else if (i.customId === 'minimize')
                                await i.update({ embeds: [minimizedEmbed], components: [maximizeRow] });
                        });

                        collector.on('end', () => {
                            embedmsg.edit(minimizedEmbed);
                            disableComponents(embedmsg);
                        });
                    });

                    addXP(message.author.id, 23, message);
                    //                     if (!dat.staff.includes(message.author.id)) message.timestamps.set(message.author.id, Date.now());
                });
        }
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
        if (reversedArr[x].length !== 0) embed.addField(`${res[x][0]} ${res[x][1]}`, `${reversedArr[x].length || 0}`);
    return embed;
}

