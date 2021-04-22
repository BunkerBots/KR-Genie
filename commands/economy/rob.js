const data = require('../../data');
const { MessageEmbed } = require('discord.js');
const db = require('../../modules/');

module.exports = {
    name: 'rob',
    aliases: ['steal'],
    cooldown: 120,
    execute: async(message, args) => {
        if (!args[1]) return message.reply('Who are we robbing?');
        const target = message.guild.members.fetch(args[1].replace(/\D/g, ''));
        try {
            await target;
        } catch (e) {
            message.channel.send(new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: false }))
                .setDescription('```diff\n- User not found')
                .setFooter('You cannot rob people who are not in this guild'));
            return;
        }
        const robchance = Math.floor(Math.random() * 2);
        target.then(async user => {
            if (user.id === message.author.id) return message.reply('Did you just try to rob yourself?..');
            if (robchance == 1) {
                const { wallet } = await db.utils.balance(user.id);
                if (wallet <= 0) return message.reply('You can\'t rob a guy with empty wallet , get a standard bro');

                const robbedKR = parseInt(Math.floor(Math.random() * wallet));
                await db.utils.addKR(user.id, -robbedKR);
                await db.utils.addKR(message.author.id, robbedKR);
                message.reply(`You stole a sweet amount of ${data.emotes.kr}${robbedKR} from ${user.user.username}`);
            } else {
                await db.utils.addKR(message.author.id, -250);
                message.reply(`You were caught stealing and lost ${data.emotes.kr}250`);
            }
        });
    },
};
