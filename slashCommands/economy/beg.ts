import { SlashCommandBuilder } from '@discordjs/builders';
import { ColorResolvable, Message, MessageEmbed } from 'discord.js';
import { emotes, beg } from '../../data/index';
import SlashCommand from '../../modules/Commands/SlashCommand';
import db from '../../modules/db/economy';
import { createEmbed, parseFileName } from '../../modules/utils';

const name = parseFileName(__filename);
const description = `This command is used to get some ${emotes.kr} from famous Krunker members based on random chances. There is a chance to gain some ${emotes.kr} or nothing at all`;
const data = new SlashCommandBuilder()
    .setName(name)
    .setDescription('Beg for kr')

export default new SlashCommand({
    name: name,
    description: description,
    data: data,
    execute: async (i) => {
        const res = Math.floor(Math.random() * 2);
        const response = {
            positive: beg.responses[Math.floor(Math.random() * beg.responses.length)],
            negative: beg.noresponse[Math.floor(Math.random() * beg.noresponse.length)],
        };
        const KR = Math.floor(Math.random() * 500) + 500;

        let args: [ColorResolvable, string, string] = ['RED', 'notstonks4u', response.negative.replace('{value}', `${emotes.kr}${KR}`)];

        if (res == 1) {
            (args = ['GREEN', 'stonks4u', response.positive.replace('{value}', `${emotes.kr}${KR}`)]);
            await db.addKR_wallet(i.user.id, KR);
        }

        i.reply({
            embeds: [createEmbed({
                title: beg.people[Math.floor(Math.random() * beg.people.length)],
                color: args[0],
                description: args[2],
                footer: args[1]
            })]
        })
    }
})


