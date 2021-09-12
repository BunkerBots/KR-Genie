import { MessageEmbed } from 'discord.js';
import Skins from '../../modules/skins.js';
import { emotes, core } from '../../data/index.js';
import marketDB from '../../modules/db/market.js';
import comma from '../../modules/comma.js';
import utils from '../../modules/messageUtils.js';
// import Paginator from '../../modules/paginate.js';
import Paginator from '../../modules/paginator.js';

export default {
    name: 'listings',
    aliases: ['skinlistings', 'listing'],
    cooldown: 10,
    description: 'Get a list of all skin listings globally',
    expectedArgs: 'k/listings',
    execute: async(message, args, bot) => {
        const msg = await message.channel.send({ embeds: [new MessageEmbed()
            .setDescription(`${emotes.loading} Loading global listings...`)] });
        const listing = await marketDB.utils.getListing(1);
        const sortedArr = listing.sort((a, b) => a.price - b.price).reverse();
        const values = [...sortedArr];
        const max = Math.ceil(values.length / 10);
        const tagsCache = global.cache.get('tags');
        const options = { author: message.author, current: 1, maxValues: values.length, max: max };
        // thiss is an arr ['collectable name']
        const paginator = new Paginator(bot, message.channel, options, async(index, dat) => {
            let tag;
            const res = [];
            for (const i of sortedArr.slice(index, index + 10)) {
                const usertag = tagsCache.find(x => x.id == i.id);
                if (usertag) {
                    tag = usertag.tag;
                    res.push({ name: tag, skin: Skins.emoteColorParse(i.rarity), skinName: i.name, id: i.id, price: i.price });
                } else {
                    const user = await utils.getID(i.userID);
                    res.push({ name: user.tag, skin: Skins.emoteColorParse(i.rarity), skinNname: i.name, id: i.id, price: i.price });
                    global.cache.set('tags', { id: i.userID, tag: user.tag });
                }
            }
            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle('Global Levels leaderboard')
                .setColor(core.embed)
                .setFooter(`${dat.page} out of ${max}`);
            for (const i of res) embed.addField(`${i.skin} ${i.skinNname} - ${emotes.kr}${comma(i.price)}`, `Item ID : \`${i.id}\` \nListed by ${i.name}`);
            const obj = { embeds: [embed] };
            return obj;
        });
        await paginator.start();
        msg.delete();
    },
};

