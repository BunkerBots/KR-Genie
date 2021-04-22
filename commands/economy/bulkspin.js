const skinfetcher = require('../../modules/skins');
const dat = require('../../data');
const { MessageEmbed } = require('discord.js');
const db = require('../../modules');
const { getRandomRaritySkin } = require('../../modules/utils');

module.exports = {
    name: 'bulkspin',
    aliases: ['bulk'],
    cooldown: 10,
    // slowmode
    // eslint-disable-next-line space-before-function-paren
    execute: async (message, args) => {
        // eslint-disable-next-line no-unused-vars
        const spinarr = [];
        if (Number.isInteger(parseInt(args[1]))) {
            if (parseInt(args[1]) > 20) return message.channel.send('You can only do 20 bulk spins per use');
            const KR = parseInt(500 * parseInt(args[1]));
            const { wallet } = await db.utils.balance(message.author.id);
            let recommended;
            const roundedval = parseInt(wallet / 500).toFixed(0);
            if (roundedval <= 0) recommended = 'Just don\'t spin LOL';
            else recommended = `${roundedval} Spins`;
            if (KR > wallet) {
                return message.reply(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                    .setDescription(`You do not have enough ${dat.emotes.kr} to do ${parseInt(args[1])}\n\`Recommended: ${recommended}\``));
            }
            message.channel.send(new MessageEmbed()
                .setDescription(`${dat.emotes.loading} Running ${parseInt(args[1])} spins!`))
                .then(async msg => {
                    const toPush = [];
                    for (let i = 0; i < parseInt(args[1]); i++) {
                        const randomSkin = getRandomRaritySkin();
                        toPush.push(randomSkin.index);
                        const emote = skinfetcher.emoteColorParse(randomSkin.rarity);
                        spinarr.push(`${emote} ${randomSkin.name}`);
                    }
                    await db.utils.addSkin(message.author.id, toPush);
                    await db.utils.addKR(message.author.id, -KR);
                    const embed = new MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                        .setTitle(`${parseInt(args[1])} Heroic spins`)
                        .setDescription(spinarr.join('\n\u200b\n'))
                        .setFooter('feeding your laziness ™');
                    message.channel.send(embed);
                    msg.delete();
                });
            // eslint-disable-next-line no-empty
        } else {

        }
    },
};
