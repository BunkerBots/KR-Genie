const Skins = require('../../scripts/skins');
const dat = require('../../data');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'inv',
    execute: async(message, args) => {
        const skinsarr = [];
        let user;
        if (!args[1] || (Number.isInteger(parseInt(args[1])) && args[1].length < 5))
            user = message.author;
        else // eslint-disable-next-line no-empty-function
            user = await message.client.users.fetch(args[1].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.reply('No one found!');
        let footer;
        let pageNumber;
        const data = await dat.economy.skinInventory(user.id);
        for (let skin of data) {
            console.log(skin);
            skin = Skins[skin];
            const rarity = Skins.emoteColorParse(skin.rarity);
            // let weap = skin.class || '';
            skinsarr.push(`${rarity} ${skin.name}`);
        }
        let i;
        if (!skinsarr.length) i = 'No data found';
        else i = skinsarr.join('\n');
        const guilds = skinsarr;

        /**
         * Creates an embed with guilds starting from an index.
         * @param {number} start The index to start from.
         */
        const generateEmbed = start => {
            const current = guilds.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: false }))
                .setTitle(`${user.username}'s Inventory`)
                .setDescription(`Showing skins ${start + 1}-${start + current.length} out of ${guilds.length}`)
                .setFooter(footer);
            current.forEach(g => embed.addField(g, '\u200b'));
            return embed;
        };
        if (guilds.length < 10) {
            footer = '1 out of 1';
            message.channel.send(generateEmbed(0));
            return;
        }

        if (!args[2]) {
            let lastPage = guilds.length / 10;
            if (!Number.isInteger(lastPage)) lastPage = parseInt(lastPage.toFixed(0)) + 1;
            footer = `1 out of ${lastPage}`;
            message.channel.send(generateEmbed(0));
        } else {
            let lastPage = guilds.length / 10;
            if (!Number.isInteger(lastPage)) lastPage = parseInt(lastPage.toFixed(0)) + 1;
            footer = `${args[2]} out of ${lastPage}`;
            pageNumber = args[2] - 1;
            const currentindex = pageNumber * 10;
            if (currentindex > guilds.length) return;
            message.channel.send(generateEmbed(currentindex));
        }
    },
};
