// import { createCanvas, loadImage } from 'canvas';
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';
import krCmd from '../../modules/leaderboards/kr.js';
import levelsCmd from '../../modules/leaderboards/xp_level.js';
import { core, timeout } from '../../data/index.js';
import { createEmbed, disableComponents } from '../../modules/messageUtils.js';

const menuOptions = [{
    label: 'KR bank leaderboard',
    description: 'Shows the leaderboard ranked by bank balance',
    value: 'bank',
},
{
    label: 'KR wallet leaderboard',
    description: 'Shows the leaderboard ranked by wallet balance',
    value: 'wallet',
},
{
    label: 'Levels leaderboard',
    description: 'Shows the leaderboard ranked by levels and xp',
    value: 'levels',
}];

export default {
    name: 'lb',
    aliases: ['leaderboard', 'lbs', 'lb', 'leaders'],
    cooldown: 5,
    description: 'Shows various leaderboards',
    expectedArgs: 'k/lb',
    execute: async(message, args, bot) => {
        if (!args[0]) initMenu();
        else {
            if (!['wallet', 'bank', 'xp', 'level', 'levels'].includes(args[0].toLowerCase())) return message.reply(createEmbed(message.author, 'RED', 'That\'s not a valid leaderboard!'));
            if (['xp', 'levels', 'level'].includes(args[0].toLowerCase())) return levelsCmd(message, args, bot);
            return krCmd.execute(message, args, bot, args[0].toLowerCase());
        }

        async function initMenu() {
            const menuEmbed = new MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.avatarURL({ dynamic: true }))
                .setDescription('Please select a leaderboard type from the menu given below')
                .addField('KR bank', '```⬩ Richest users in terms of bank balance```', true)
                .addField('KR wallet', '```⬩ Richest users in terms of wallet balance```', true)
                .addField('Levels', '```⬩ Top ranked users based on levels and xp```', true)
                .setColor(core.embed)
                .setTimestamp();


            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('leaderboards')
                        .setMaxValues(1)
                        .setPlaceholder('Select a leaderboard type')
                        .addOptions(menuOptions),
                );

            const menu = await message.reply({ components: [row], embeds: [menuEmbed], failIfNotExists: false });

            const collector = menu?.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: timeout.inventory });

            collector.on('collect', async i => {
                if (await global.handleInteraction(i, message)) return;
                // if (i.user.id !== message.author.id) return i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
                if (i.values[0] == 'bank') krCmd.execute(message, args, bot, 'bank');
                else if (i.values[0] == 'wallet') krCmd.execute(message, args, bot, 'wallet');
                else if (i.values[0] == 'levels') levelsCmd.execute(message, args, bot);
                menu.delete();
            });

            collector.on('end', (i) => { if (i.size == 0) disableComponents(menu); });
        }
    }
};
