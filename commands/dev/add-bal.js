import data, { devs, staff } from '../../data';
import db from '../../modules';
import logger from '../../modules/logger';
import comma from '../../modules/comma';
import { createEmbed } from '../../modules/messageUtils';


export const name = 'add';
export const cooldown = 0;
export const aliases = ['add-kr', 'add-balance', 'addkr'];
export const description = 'A command available for devs and staff to spawn KR';
export const expectedArgs = 'k/add (@user) (amount)';
export const dev = true;
export async function execute(message, args) {
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
