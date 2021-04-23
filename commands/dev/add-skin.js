const data = require('../../data');
const skins = require('../../modules/skins');
const db = require('../../modules');
module.exports = {
    name: 'addskin',
    execute: async(message, args) => {
        if (!data.devs.includes(message.author.id)) return;
        if (!args[0]) return;
        const target = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!target) return message.channel.send('Unknown user');
        args.shift();
        const skin = args.join(' ').toLowerCase();
        const found = await skins.allSkins.find(x => x.name.toLowerCase() == skin);
        if (found == undefined) return message.channel.send('Unknown skin');
        console.log(found);
        await db.utils.addSkin(target.id, found.index);
        message.channel.send(`Successfully added \`${skin}\` to \`${target.username}\``);
    },
};
