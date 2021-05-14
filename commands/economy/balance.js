import { MessageEmbed } from 'discord.js';
import { emotes } from '../../data/';
import { utils as _utils } from '../../modules';
import comma from '../../modules/comma';
import { createEmbed, color as _color } from '../../modules/messageUtils';

export const name = 'balance';
export const aliases = ['bal', 'kr'];
export const cooldown = 2;
export const description = `Check your ${emotes.kr} balance, or someone else's. Displays wallet, bank and net worth.`;
export const expectedArgs = 'k/balance [ID / @user]';
export async function execute(message, args) {
    let user;
    if (!args[0])
        user = message.author;

    else
        user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => { });

    if (!user)
        return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
    const color = await _color(user);

    const { wallet, bank } = await _utils.balance(user.id);
    message.reply(new MessageEmbed()
        .setAuthor(`${user.username}'s balance`, user.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Wallet:** ${emotes.kr} ${comma(wallet)}\n**Bank:** ${emotes.kr} ${comma(bank)}\n**Net:** ${emotes.kr} ${comma(wallet + bank)}`)
        .setTimestamp()
        .setColor(`${await color}`)
        .setFooter('stonks'));
}
