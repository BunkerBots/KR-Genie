import Skins from '../../modules/skins.js';
import dat from '../../data/index.js';
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';
import db from '../../modules/db/economy.js';
import utils from '../../modules/utils.js';
import { addXP } from '../../modules/db/levels.js';
import msgUtils from '../../modules/messageUtils.js';
import { starterSpin, eliteSpin } from '../../modules/spins.js';


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
    name: 'spin',
    aliases: ['heroic'],
    cooldown: 10,
    description: 'Addicted to in-game spins? Have an unquenchable thirst for gambling? This command is the one for you! Use bot currency to unbox tons of amazing skins! The chances of unboxing a certain rarity are very similar to the chances in the game itself',
    expectedArgs: 'k/spin',
    execute: async(message, args) => {
        if (!args[0]) {
            const menuEmbed = new MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.avatarURL({ dynamic: true }))
                .setTitle('Spin menu')
                .setDescription('We currently have `three` types of spins with different chances! please pick one from the drop down menu')
                .addField('Starter', '```⬩ 50 KR\n⬩ Maximum rarity - Epic```', true)
                .addField('Elite', '```⬩ 150 KR\n⬩ Maximum rarity - Legendary```', true)
                .addField('Heroic', '```⬩ 500 KR\n⬩ Maximum rarity - Unobtainable```', true)
                .addField('\u200b', 'You can use `k/spin [spin name]` to bypass the menu!')
                .setColor(dat.core.embed)
                .setTimestamp();


            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('inventory')
                        .setMaxValues(1)
                        .setPlaceholder('Select a spin type')
                        .addOptions(menuOptions),
                );

            const menu = await message.reply({ components: [row], embeds: [menuEmbed], failIfNotExists: false });

            const collector = menu?.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: dat.timeout.spin });

            collector.on('collect', async i => {
                if (await global.handleInteraction(i, message)) return;
                Spin(i.values[0]);
                menu.delete();
                collector.stop();
            });

            collector.on('end', (i) => { if (i.size == 0) msgUtils.disableComponents(menu); });
        } else if (args[0]) {
            if (!['heroic', 'starter', 'elite'].includes(args[0].toLowerCase())) return message.reply(msgUtils.createEmbed(message.author, 'RED', 'That\'s not a valid spin mate'));
            Spin(args[0].toLowerCase());
        }

        async function Spin(spin) {
            let amount, func, type;
            if (spin == 'heroic') amount = 500, func = utils.getRandomRaritySkin, type = 'Heroic';
            else if (spin == 'starter') amount = 50, func = starterSpin, type = 'Starter';
            else if (spin == 'elite') amount = 150, func = eliteSpin, type = 'Elite';
            const { wallet } = await db.utils.balance(message.author.id);
            if (wallet < parseInt(amount)) return message.channel.send(msgUtils.createEmbed(message.author, 'RED', `you do not have ${dat.emotes.kr}500 to do a heroic spin`));
            const randomSkin = func();
            await db.utils.addKR(message.author.id, -parseInt(amount));
            if (randomSkin.index == 1659)
                await db.utils.addItem(message.author.id, 3);
            else if (randomSkin.index == 944)
                await db.utils.addItem(message.author.id, 2);
            else
                await db.utils.addSkin(message.author.id, randomSkin.index);

            message.reply({ embeds: [new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`${dat.emotes.kr} ${type} Spin`)
                .setColor(`${Skins.colorParse(randomSkin.rarity)}`)
                .setDescription(`You unboxed **${randomSkin.name}**!`)
                .addFields(
                    { name: 'Rarity', value: `${Skins.emoteColorParse(randomSkin.rarity)}`, inline: true },
                    { name: 'Creator', value: `${randomSkin.creator || 'Krunker.io'}`, inline: true },
                    { name: 'Season', value: `${randomSkin.season || '1'}`, inline: true },
                )
                .setThumbnail(Skins.getPreview(randomSkin))
                .setFooter('Feeding your gambling addiction ™')], allowedMentions: { repliedUser: false }, failIfNotExists: false });
            addXP(message.author.id, 23, message);
            await db.utils.addSpinCount(message.author.id, 1);
        }
    },
};
