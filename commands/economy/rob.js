import data, { devs } from '../../data/index.js';
import { MessageEmbed } from 'discord.js';
import db from '../../modules/db/economy.js';
import comma from '../../modules/comma.js';
import notify from '../../modules/notification.js';
import { createEmbed } from '../../modules/messageUtils.js';
import { findItem, useItem } from '../../modules/utils.js';


export default {
    name: 'rob',
    aliases: ['steal'], // merge
    cooldown: 1200,
    description: `Feeling evil? Nothing like stealing someone's krunkies, there 
    is a chance of getting caught by the KPD and losing ${data.emotes.kr}, There are a number of items that can defend against robberies exercise caution.`,
    expectedArgs: 'k/rob (ID / @user)',
    manualStamp: true,
    execute: async(message, args, bot) => {
        if (!args[0]) return message.reply(createEmbed(message.author, 'RED', 'Who are we robbing?'));
        const target = message.guild.members.resolve(args[0]) ||
        message.guild.members.cache.find(x => x.user.tag == args[0]) ||
        message.mentions.members.first();
        if (!target || target === null) return message.reply(createEmbed(message.author, 'RED', 'Unknown user'));
        const i = await db.utils.balance(message.author.id);
        if (i.wallet < parseInt(250)) return message.reply(createEmbed(message.author, 'RED', `You atleast need ${data.emotes.kr}250 in your wallet!`));
        if (target.id === message.author.id) return message.reply(createEmbed(message.author, 'RED', 'Did you just try to rob yourself?..'));
        if (target.id === bot.user.id) return message.reply(createEmbed(message.author, 'RED', 'Bro atleast leave the bot alone smh'));
        if (devs.includes(target.id)) return message.reply(createEmbed(message.author, 'RED', 'Did you really just try to rob a bot dev?'));
        const { wallet } = await db.utils.balance(target.id);
        if (wallet <= 0) return message.reply(createEmbed(message.author, 'RED', 'You can\'t rob a guy with an empty wallet , get a standard bro'));
        const padlock = await findItem(target.id, 'padlock');
        if (padlock != undefined) {
            const chancetobreak = Math.floor(Math.random() * 100);

            if (chancetobreak <= 25) {
                await useItem(target.id, 'padlock');
                await db.utils.addKR(message.author.id, -parseInt(250));
                notify(target, 'An item broke',
                    `Your padlock broke when \`${message.author.tag}\` tried to steal from you in \`${message.guild.name}\``,
                    'RED', 'Time to buy a new padlock');
            } else
                await db.utils.addKR(message.author.id, -parseInt(250));

            message.reply({ embeds: [new MessageEmbed()
                .setColor('RED')
                .setDescription(`You tried robbing ${target.user.username} but you realized they had a massive padlock on their wallet. The KPD fined you ${data.emotes.kr}250.`)
                .setFooter('Smh what a loser')], failIfNotExists: false });
            message.timestamps.set(message.author.id, Date.now());
            return;
        }
        const robchance = Math.floor(Math.random() * 2);
        if (robchance == 1) {
            const robbedKR = parseInt(Math.floor(Math.random() * wallet));
            await db.utils.addKR(target.id, -robbedKR);
            await db.utils.addKR(message.author.id, robbedKR);
            message.reply(createEmbed(message.author, 'GREEN', `You stole a sweet amount of ${data.emotes.kr}${comma(robbedKR)} from ${target.user.username}`));
            notify(target, 'You got robbed',
                `\`${message.author.tag}\` stole ${data.emotes.kr}${comma(robbedKR)} from you in \`${message.guild.name}\``,
                'RED', 'Smh buy a padlock already');
        } else {
            await db.utils.addKR(message.author.id, -parseInt(250));
            message.reply(createEmbed(message.author, 'RED', `You were caught stealing and lost ${data.emotes.kr}250`));
        }
        message.timestamps.set(message.author.id, Date.now());
    },
};
