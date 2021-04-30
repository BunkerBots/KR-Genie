const data = require('../../data'),
    db = require('../../modules'),
    devs = data.devs,
    logger = data.logger,
    staff = data.staff;
module.exports = {
    name: 'add',
    cooldown: 0,
    aliases: ['add-kr', 'add-balance', 'addkr'],
    description: 'A command available for devs and staff to spawn KR',
    expectedArgs: 'k/add (@user) (amount)',
    dev: true,
    execute: async(message, args) => {
        if (!(devs.includes(message.author.id) || staff.includes(message.author.id))) return;
        if (!args[0]) return message.reply(`Provide an user to add ${data.emotes.kr} to!`);
        const user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.reply('Unkown user!');
        const KR = parseInt(args[1]);
        if (isNaN(KR)) {
            message.reply('fam you need to specify a valid number of KR.');
            return;
        }
        const newKR = await db.utils.addKR(user.id, KR);
        message.reply(`You have given <@${user.id}> ${data.emotes.kr}${KR}. They now have ${data.emotes.kr}${newKR}!`);
        logger.commandsLog(message.author, 'add', `**${message.author.tag}** (dev) added \`${KR}\` to **${user.tag}**`, message.guild, args.join(' '), `KR: ${KR}`);
    },
};
