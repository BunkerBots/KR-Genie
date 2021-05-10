const skinfetcher = require('../../modules/skins');
const dat = require('../../data');
const { MessageEmbed } = require('discord.js');
const db = require('../../modules');
const { getRandomRaritySkin } = require('../../modules/utils');
const { createEmbed } = require('../../modules/messageUtils'),
    levels = require('../../mongo');

module.exports = {
    name: 'bulkspin',
    aliases: ['bulk'],
    cooldown: 10,
    description: 'Tired of using individual spins? This command will help you to do multiple spins in one go',
    expectedArgs: 'k/bulkspin (number)',
    // slowmode
    // eslint-disable-next-line space-before-function-paren
    execute: async (message, args) => {
        // eslint-disable-next-line no-unused-vars
        let limit = 10;
        const premium = await db.utils.premium(message.author.id);
        const verified = await db.utils.verified(message.author.id);
        if (verified == true) limit = 15;
        if (premium == true) limit = 20;
        const spinarr = [];
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
                return message.reply(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                    .setDescription(`You do not have enough ${dat.emotes.kr} to do ${parseInt(args[0])} spins\n\`Recommended: ${recommended}\``));
            }
            message.channel.send(new MessageEmbed()
                .setDescription(`${dat.emotes.loading} Running ${parseInt(args[0])} spins!`))
                .then(async msg => {
                    const skinToPush = [];
                    const itemToPush = [];
                    for (let i = 0; i < parseInt(args[0]); i++) {
                        const randomSkin = getRandomRaritySkin();
                        if (randomSkin.index == 1659)
                            itemToPush.push(3);
                        else if (randomSkin.index == 944)
                            itemToPush.push(2);
                        else
                            skinToPush.push(randomSkin.index);
                        // skinToPush.push(randomSkin.index);
                        const emote = skinfetcher.emoteColorParse(randomSkin.rarity);
                        spinarr.push(`${emote} ${randomSkin.name}`);
                    }
                    if (skinToPush.length != 0) await db.utils.addSkin(message.author.id, skinToPush);
                    if (itemToPush.length != 0) await db.utils.addItem(message.author.id, itemToPush);
                    await db.utils.addKR(message.author.id, -KR);
                    await db.utils.addSpinCount(message.author.id, parseInt(args[0]));
                    const embed = new MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                        .setTitle(`${parseInt(args[0])} Heroic spins`)
                        .setDescription(spinarr.join('\n\u200b\n'))
                        .setFooter('feeding your laziness ™');
                    message.channel.send(embed);
                    msg.delete();
                    levels.addXP(message.author.id, 23, message);
                });
        } else
            return message.reply(createEmbed(message.author, 'RED', `Expected a number and gave me some random \`${args.join(' ')}\``));
    },
};
