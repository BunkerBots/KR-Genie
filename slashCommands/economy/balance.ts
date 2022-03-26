import { SlashCommandBuilder } from '@discordjs/builders';
import { Message, User } from 'discord.js';
import SlashCommand from '../../modules/Commands/SlashCommand';
import economyDB from '../../modules/db/economy';
import comma from '../../modules/comma';
import { createEmbed } from '../../modules/utils';
import emotes from '../../data/JSON/emotes.json';

const data = new SlashCommandBuilder()
    .setName('balance')
    .setDescription('shows the balance of a user')
    .addUserOption(option => option.setName('user').setRequired(false).setDescription('user to display'));

export default new SlashCommand({
    name: 'balance',
    data: data,
    execute: async (interaction) => {
        let user: User | string = interaction.options.getUser('user');

        user = user ? user : interaction.user;

        const { wallet, bank } = await economyDB.balance(user.id);

        interaction.reply({
            embeds: [
                createEmbed({
                    author: {
                        name: `${user.username}'s balance`,
                        iconURL: user.displayAvatarURL({ dynamic: true })
                    },
                    description: `**Wallet:** ${emotes.kr} ${comma(wallet)}\n**Bank:** ${emotes.kr} ${comma(bank.balance)} / ${comma(bank.limit)}\n**Net:** ${emotes.kr} ${comma(wallet + bank.balance)}`,
                    timestamp: true,
                    footer: 'stonks'
                })
            ]
        })
    }
})
