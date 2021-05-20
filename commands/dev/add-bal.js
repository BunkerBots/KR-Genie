const comma = require('../../modules/comma'),
    { createEmbed } = require('../../modules/messageUtils'),
    data = require('../../data'),
    db = require('../../modules'),
    devs = data.devs,
    logger = require('../../modules/logger'),
    staff = data.staff;

module.exports = {
    name: 'add',
    aliases: ['add-kr', 'add-balance', 'addkr'],
    description: 'A command available for devs and staff to spawn KR',
    expectedArgs: 'k/add (@user) (amount)',
    cooldown: 0,
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id))) return;
        if (!args[0]) return message.reply(`Provide an user to add ${data.emotes.kr} to!`);

        const user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.reply(createEmbed(message.author, 'RED', 'Unkown user!'));

        const KR = parseInt(args[1]);
        if (isNaN(KR)) return message.reply(createEmbed(message.author, 'RED', 'fam you need to specify a valid number of KR.'));

        await db.utils.addKrToBank(user.id, KR);
        message.reply(createEmbed(message.author, 'GREEN', `Successfully added ${data.emotes.kr}${comma(KR)} to \`${user.username}\`. They now have ${data.emotes.kr}${comma(await db.utils.balance(user.id).bank)}!`));

        logger.commandsLog(message.author, 'add', `**${message.author.tag}** added \`${comma(KR)}\` to **${user.tag}**`, message.guild, args.join(' '), `KR: ${KR}`);
    },
};