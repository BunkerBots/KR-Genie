import db from '../../modules/db/economy.js';
import data, { emotes } from '../../data/index.js';
import { MessageActionRow, MessageEmbed, MessageButton } from 'discord.js';
import { getXP, getLevel } from '../../modules/db/levels.js';
import { getEmbedColor, parseEmbedColor, createEmbed, parseBadge, disableComponents } from '../../modules/messageUtils.js';
import inventoryCmd from './inventory.js';
import tradeCmd from '../market/trade.js';
import { InventoryParser } from '../../modules/index.js';
import comma from '../../modules/comma.js';

export default {
    name: 'profile',
    aliases: ['userinfo', 'p'],
    cooldown: 10,
    description: 'Shows an user\'s profile with information like badges, economy status, levels etc',
    expectedArgs: 'k/profile [ID / @user]',
    execute: async(message, args) => {
        let user;
        if (!args[0]) user = message.author;
        else user = await message.client.users.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        if (!user) return message.channel.send(createEmbed(message.author, 'RED', 'Unknown user'));
        // eslint-disable-next-line prefer-const
        const { wallet, bank } = await db.utils.balance(user.id),
            netWorth = parseInt(wallet + bank),
            xp = await getXP(user.id),
            level = await getLevel(user.id);
            // eslint-disable-next-line no-unused-vars
        const badgesArr = await parseBadge(user.id);
        const embedColor = getEmbedColor(level),
            color = parseEmbedColor(level);
        const userItems = await db.utils.itemInventory(user.id);
        const parser = new InventoryParser(userItems);
        const activeItems = parser.parseItems();
        let badges;
        let tagged;
        if (netWorth >= parseInt(1000000)) badgesArr.push(`${emotes.millionaire}`);
        if (badgesArr.includes(emotes.hackertagged)) badges = '', tagged = 'https://media.discordapp.net/attachments/831950107649638410/845749925655347200/hackertagged.png';
        else tagged = '', badges = `${badgesArr.join(' ')}`;

        const tradebtn = new MessageButton()
            .setLabel('Trade')
            .setCustomId('trade');
        if (user == message.author || level < 5) tradebtn.setStyle('DANGER').setDisabled(true);
        else tradebtn.setStyle('SUCCESS');

        const inventorybtn = new MessageButton()
            .setLabel('Inventory')
            .setCustomId('inventory')
            .setStyle('SUCCESS');

        const giftkrbtn = new MessageButton()
            .setLabel('Gift')
            .setEmoji('831858218456055818')
            .setCustomId('gift');
        if (user == message.author || level < 5) giftkrbtn.setStyle('DANGER').setDisabled(true);
        else giftkrbtn.setStyle('SUCCESS');


        const row = new MessageActionRow()
            .addComponents(inventorybtn, tradebtn, giftkrbtn);


        const embed = new MessageEmbed()
            .setAuthor(`${user.username}`)
            .setTitle(badges)
            .setImage(tagged)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setColor(`${await embedColor}`)
        // .setDescription('*biography coming soon™*')
            .addFields(
                { name: 'Level', value: `\`${level}\``, inline: true },
                { name: 'xp', value: `\`${xp[0]}/${xp[1]}\``, inline: true },
                { name: 'Level color', value: `${await color}`, inline: true },
                { name: 'Wallet', value: `\`${wallet}\``, inline: true },
                { name: 'Bank', value: `\`${bank}\``, inline: true },
                { name: 'Net worth', value: `\`${netWorth}\``, inline: true },
                { name: 'Active Items', value: `${activeItems.join('\n') || 'Nothing to see here'}` },
            );
        const profMsg = await message.channel.send({ embeds: [embed], components: [row] });

        const filter = i => i.user.id === message.author.id;
        const collector = profMsg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 20000 });
        // const c = new Collector(message, filter, 10000);
        // const collector = c.initBtnCollector();
        collector.on('collect', async i => {
            // if (i.user.id !== message.author.id) return i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
            console.log(i.user.id, message.author.id);
            if (i.customId === 'inventory') inventoryCmd.execute(message, args);
            else if (i.customId === 'trade') tradeCmd.execute(message, args);
            else if (i.customId === 'gift') gift();
            profMsg.delete();
            collector.stop();
        });

        collector.on('end', (i) => { if (i.size == 0) disableComponents(profMsg); });


        async function gift() {
            const giftEmbed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(`How much ${data.emotes.kr} do you want to gift ${user.username}`);
            const gfitMsg = await message.channel.send({ embeds: [giftEmbed] });


            const msgfilter = i => i.user.id === message.author.id;
            const msgcollector = message.channel.createMessageCollector({ msgfilter, time: 20000 });
            msgcollector.on('collect', async i => {
                if (i.author.id !== message.author.id) return;
                const arg = i.content.toLowerCase();
                if (arg.startsWith('k/')) return;
                const parsedKR = isNaN(parseInt(arg));
                const krAmount = parseInt(arg);
                if (parsedKR) return message.reply(createEmbed(message.author, 'RED', 'You need to provide a valid amount of kr'));
                if (krAmount <= 0) return message.reply(createEmbed(message.author, 'RED', 'Atleast don\'t be so greedy while gifting :sob:'));
                if (krAmount > wallet) return message.reply(createEmbed(message.author, 'RED', `You do not have ${krAmount} KR in your wallet`));
                const tenpercent = Math.ceil(10 * krAmount / 100);
                const premium = await db.utils.premium(message.author.id);
                await db.utils.addKR(message.author.id, -krAmount);
                const authorbal = await db.utils.balance(message.author.id);
                const userbal = await db.utils.balance(user.id);
                let kr, desc;
                if (premium == true) {
                    kr = krAmount;
                    desc = `You gave <@${user.id}> ${data.emotes.kr}${comma(krAmount)} , now you have ${data.emotes.kr}${comma(authorbal.wallet)} and they've got ${data.emotes.kr}${comma(userbal.bank + krAmount)}.`;
                } else {
                    kr = parseInt(krAmount - tenpercent);
                    desc = `You gave <@${user.id}> ${data.emotes.kr}${comma(krAmount)} after 10% tax, now you have ${data.emotes.kr}${comma(authorbal.wallet)} and they've got ${data.emotes.kr}${comma(userbal.bank + krAmount)}.`;
                }
                await db.utils.addKrToBank(user.id, kr);
                const giveEmbed = createEmbed(message.author, 'GREEN', desc);
                message.reply(giveEmbed);
                console.log(user.id);
                gfitMsg?.delete();
                msgcollector.stop();
            });

            msgcollector.on('end', () => { if (!gfitMsg.deleted) gfitMsg?.delete(); });
        }
    },
};

