const skinfetcher = require('../../scripts/skins');
const dependencies = require('../../data');
const { MessageEmbed } = require('discord.js');
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
            const { wallet } = await dependencies.economy.balance(message.author.id);
            let recommended;
            const roundedval = parseInt(wallet / 500).toFixed(0);
            if (roundedval <= 0) recommended = 'Just don\'t spin LOL';
            else recommended = `${roundedval} Spins`;
            if (KR > wallet) {
                return message.reply(new MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                    .setDescription(`You do not have enough ${dependencies.emotes.kr} to do ${parseInt(args[1])}\n\`Recommended: ${recommended}\``));
            }
            message.channel.send(new MessageEmbed()
                .setDescription(`${dependencies.emotes.loading} Running ${parseInt(args[1])} spins!`))
                .then(async msg => {
                    // eslint-disable-next-line no-undef
                    for (i = 0; i < parseInt(args[1]); i++) {
                        const rarity = Math.floor(Math.random() * 10000);
                        let randomskin;
                        if (rarity <= 1)
                            randomskin = skinfetcher.sorted[6][Math.floor(Math.random() * skinfetcher.sorted[6].length)];
                        else if (rarity > 1 && rarity <= 50)
                            randomskin = skinfetcher.sorted[5][Math.floor(Math.random() * skinfetcher.sorted[5].length)];
                        else if (rarity > 50 && rarity <= 249)
                            randomskin = skinfetcher.sorted[4][Math.floor(Math.random() * skinfetcher.sorted[4].length)];
                        else if (rarity > 249 && rarity <= 1400)
                            randomskin = skinfetcher.sorted[3][Math.floor(Math.random() * skinfetcher.sorted[3].length)];
                        else if (rarity > 1400 && rarity <= 3500)
                            randomskin = skinfetcher.sorted[2][Math.floor(Math.random() * skinfetcher.sorted[2].length)];
                        else if (rarity > 3500 && rarity <= 10000)
                            randomskin = skinfetcher.sorted[1][Math.floor(Math.random() * skinfetcher.sorted[1].length)];

                        const preview = skinfetcher.getPreview(randomskin);
                        // eslint-disable-next-line no-unused-vars
                        const weaponRarity = skinfetcher.textColorParse(randomskin.rarity);
                        const color = skinfetcher.colorParse(randomskin.rarity);
                        let weap;
                        if (randomskin.weapon) weap = randomskin.weapon;
                        // eslint-disable-next-line no-unused-vars
                        else weap = '';
                        // const type = skinfetcher.getWeaponByID(weap);
                        // console.log(color);
                        let season;
                        if (randomskin.seas) season = randomskin.seas;
                        else season = '1';
                        // eslint-disable-next-line no-unused-vars
                        let creator;
                        const skininfo = { name: randomskin.name.toLowerCase(), id: randomskin.id, rarity: randomskin.rarity, color: color, link: preview, seas: season, index: randomskin.index }; // , class: randomskin.weapon };
                        await dependencies.economy.addSkin(message.author.id, skininfo.index);
                        // if (randomskin.creator) creator = randomskin.creator;
                        // else creator = 'krunker.io';
                        // const skininfo = { name: randomskin.name.toLowerCase(), id: randomskin.id, rarity: randomskin.rarity, color: color, link: preview, seas: season, class: randomskin.weapon };
                        const emote = skinfetcher.emoteColorParse(randomskin.rarity);
                        spinarr.push(`${await emote} ${randomskin.name}`);
                    }
                    await dependencies.economy.addKR(message.author.id, -KR);
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
