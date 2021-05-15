import data, { devs, staff } from '../../data/index.js';
import db from '../../modules/db.js';
import logger from '../../modules/logger.js';
import comma from '../../modules/comma.js';
import { createEmbed } from '../../modules/messageUtils.js';


export default {
    name: 'add',
    cooldown: 0,
    aliases: ['add-kr', 'add-balance', 'addkr'],
    description: 'A command available for devs and staff to spawn KR',
    expectedArgs: 'k/add (@user) (amount)',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id)))
            return;
        if (!args[0])
            return message.reply(`Provide an user to add ${data.emotes.kr} to!`);
        const user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });
        if (!user)
            return message.reply(createEmbed(message.author, 'RED', 'Unkown user!'));
        const KR = parseInt(args[1]);
        if (isNaN(KR)) {
            message.reply(createEmbed(message.author, 'RED', 'fam you need to specify a valid number of KR.'));
            return;
        }
        await db.utils.addKrToBank(user.id, KR);
        const bal = await db.utils.balance(user.id),
            bankbal = bal.bank;
        message.reply(createEmbed(message.author, 'GREEN', `Successfully added ${data.emotes.kr}${comma(KR)} to \`${user.username}\`. They now have ${data.emotes.kr}${comma(bankbal)}!`));
        logger.commandsLog(message.author, 'add', `**${message.author.tag}** added \`${comma(KR)}\` to **${user.tag}**`, message.guild, args.join(' '), `KR: ${KR}`);
    }
};

