import { Message, MessageEmbed, MessageButton, MessageActionRow } from 'discord.js';
import core from '../data/JSON/core.json';
// import { table } from 'table';
// import utils from './messageUtils.js';

class StaticEmbeds {

    /**
     * Embed pages generator (static)
     * @param {Array} arr
     * @param {*} user
     * @param {Array} args
     * @param {Number} startIndex
     */
    constructor(message, arr, user, args, description) {
        this.message = message;
        this.arr = arr;
        this.user = user;
        this.footer = '';
        this.pageNumber = '';
        this.args = args;
        this.description = description;
        this.msg; // bot embed msg
    }

    generateEmbed(type, description) {
        const generateEmbed = (start) => {
            const current = this.arr.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${this.message.author.username}`, this.message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(this.user ? `${this.user.username}'s ${type}` : `${type}`)
                .setColor(core.embed)
                .setDescription(this.description ? description : `${description} ${start + 1}-${start + current.length} out of ${this.arr.length}`)
                .setFooter(`${this.footer[0]} out of ${this.footer[1]}`);
            current.forEach(g => embed.addField('\u200b', g));
            return embed;
        };
        if (this.arr.length < 10) {
            this.footer = '1 out of 1';
            this.message.channel.send(generateEmbed(0));
            return;
        }

        const page = this.args.shift();
        let lastPage;
        if (!page) {
            lastPage = Math.ceil(this.arr.length / 10);
            this.footer = ['1', `${Math.ceil(this.arr.length / 10)}`];
            const backbtn = new MessageButton().setStyle('SUCCESS').setCustomId('-1').setEmoji('871393934125965403'),
                closebtn = new MessageButton().setStyle('DANGER').setCustomId('close').setEmoji('871392556372623360'),
                fwbtn = new MessageButton().setStyle('SUCCESS').setCustomId('1').setEmoji('871393934096601088');
            backbtn.setDisabled(true);
            const btns = [backbtn, closebtn, fwbtn];
            this.message.channel.send({ embeds: [generateEmbed(0)], components: [new MessageActionRow().addComponents(...btns)] }).then(m => this.msg = m);
        } else {
            // eslint-disable-next-line no-unused-vars
            lastPage = Math.ceil(this.arr.length / 10);
            this.footer = [`${page}`, `${Math.ceil(this.arr.length / 10)}`];
            this.pageNumber = page - 1;
            const currentindex = parseInt(this.pageNumber * 10);
            console.log(currentindex);
            if (currentindex > this.arr.length) return;
            const backbtn = new MessageButton().setStyle('SUCCESS').setCustomId(`${currentindex - 1}`).setEmoji('871393934125965403'),
                closebtn = new MessageButton().setStyle('DANGER').setCustomId('close').setEmoji('871392556372623360'),
                fwbtn = new MessageButton().setStyle('SUCCESS').setCustomId(`${currentindex + 1}`).setEmoji('871393934096601088');
            if (currentindex >= this.footer[1] - 1) fwbtn.setDisabled(true);
            if (currentindex <= 0) backbtn.setDisabled(true);
            const btns = [backbtn, closebtn, fwbtn];
            this.message.channel.send({ embeds: [generateEmbed(currentindex)], components: [new MessageActionRow().addComponents(...btns)] }).then(m => this.msg = m);
        }

        const filter = i => i.user.id === this.message.author.id;
        const collector = this.message.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 5000 });

        collector.on('collect', async i => {
            // if (i.user.id !== message.author.id) return i.reply({ content: 'These buttons aren\'t for you!', ephemeral: true });
            // console.log(i.user.id, this.message.author.id);
            const pageNum = parseInt(i.customId);
            console.log(pageNum);
            const backbtn = new MessageButton().setStyle('SUCCESS').setCustomId(`${pageNum - 1}`).setEmoji('871393934125965403'),
                closebtn = new MessageButton().setStyle('DANGER').setCustomId('close').setEmoji('871392556372623360'),
                fwbtn = new MessageButton().setStyle('SUCCESS').setCustomId(`${pageNum + 1}`).setEmoji('871393934096601088');
            if (i.customId == 'close') return this.msg.delete();
            if (pageNum >= this.footer[1] - 1) fwbtn.setDisabled(true);
            if (pageNum <= 0) backbtn.setDisabled(true);
            const btns = [backbtn, closebtn, fwbtn];
            this.footer[0] = pageNum + 1;
            await i.update({ embeds: [generateEmbed(pageNum)], components: [new MessageActionRow().addComponents(...btns)] });
        });

        collector.on('end', async() => console.log('end'));
    }

    // async tableParser() {
    //     const sortByCash = this.message.content.includes('--cash');
    //     const generateEmbed = async(start) => {
    //         const current = this.arr.slice(start, start + 10);
    //         const embed = new MessageEmbed()
    //             .setAuthor(`Requested by ${this.message.author.username}`, this.message.author.displayAvatarURL({ dynamic: true }))
    //             // .setTitle(this.user ? `${this.user.username}'s ${type}` : `${type}`)
    //             // .setDescription(`${description} ${start + 1}-${start + current.length} out of ${this.arr.length}`)
    //             .setFooter(this.footer);
    //         const lbUsers = [];
    //         for (const i of current) {
    //             console.log('loop');
    //             const index = current.indexOf(i);
    //             const bankBal = i.balance.wallet + (sortByCash ? 0 : i.balance.bank);
    //             const user = await utils.getID(i.id);
    //             lbUsers.push([index + 1, `${user.tag}`, `${bankBal}`]);
    //         }
    //         lbUsers.unshift(['', 'KR Leaderboard', '']);
    //         const dat = table(lbUsers);
    //         embed.setDescription(`\`\`\`${dat}\`\`\``);
    //         console.log(dat);

    //         return embed;
    //     };
    //     if (this.arr.length < 10) {
    //         this.footer = '1 out of 1';
    //         this.message.channel.send('Generating tables').then(async msg => {
    //             this.message.channel.send(await generateEmbed(0));
    //             msg.delete();
    //         });
    //         return;
    //     }

    //     const page = this.args.shift();
    //     if (!page) {
    //         const lastPage = Math.ceil(this.arr.length / 10);
    //         this.footer = `1 out of ${lastPage}`;
    //         this.message.channel.send('Generating tables').then(async msg => {
    //             this.message.channel.send(await generateEmbed(0));
    //             msg.delete();
    //         });
    //     } else {
    //         const lastPage = Math.ceil(this.arr.length / 10);
    //         this.footer = `${page} out of ${lastPage}`;
    //         this.pageNumber = page - 1;
    //         const currentindex = parseInt(this.pageNumber * 10);
    //         console.log(currentindex);
    //         if (currentindex > this.arr.length) return;
    //         this.message.channel.send('Generating tables').then(async msg => {
    //             this.message.channel.send(await generateEmbed(currentindex));
    //             msg.delete();
    //         });
    //     }
    // }

}

Message.prototype.staticEmbeds = StaticEmbeds;
export default StaticEmbeds;

