import db from '../../modules/db/economy.js';
import { createEmbed } from '../../modules/messageUtils.js';
import { InventoryParser } from '../../modules/index.js';
import Paginator from '../../modules/paginate.js';
import { core } from '../../data/index.js';
import { MessageEmbed } from 'discord.js';


export default {
    name: 'skins',
    aliases: ['skinsinv'],
    cooldown: 5,
    description: 'Shows the list of skins owned by an user',
    expectedArgs: 'k/skins [ID / @user]',
    execute: async(message, args) => {
        let user;
        if (!args[0] || (Number.isInteger(parseInt(args[0])) && args[0].length < 5))
            user = message.author;
        else {
            const target = await message.client.users.fetch(args.shift().replace(/\D/g, '')).catch(() => {});
            if (!target) return message.reply(createEmbed(message.author, 'RED', 'No user found!'));
            else user = target;
        }
        const data = await db.utils.skinInventory(user.id);
        const parser = new InventoryParser(data);
        const values = await parser.parseSkins();
        const max = Math.ceil(values.length / 10);
        let page; // l = (args[0] || 1);
        if (Number.isInteger(parseInt(args[0]))) page = args[0];
        else page = 1;
        if (page <= 0) return message.reply('Page no. has to be greater than 0, nitwit');
        if (page > max) page = max;

        const paginator = new Paginator(message.client, message.channel, {
            page,
            author: message.author,
            embed: {
                color: 'GREEN',
            },
            max,
            count: 10,
            maxValues: values.length,
        }, async(index, count) => {
            // const lbUsers = [];
            // const embed = new MessageEmbed()
            //     .setAuthor(`Requested by ${message.author.username}`, this.message.author.displayAvatarURL({ dynamic: true }))
            //     .setTitle(`${user.username}'s Skins`)
            //     .setColor(core.embed)
            //     .setDescription(`${index + 1}-${index + count} out of ${this.arr.length}`)
            //     .setFooter(this.footer);
            let str = '';
            [...values].splice(index, count).forEach(g => str += g);
            return str;
        });
        await paginator.start();
        return new Promise((resolve) => {
            paginator.on('end', resolve);
        });
    },
};

