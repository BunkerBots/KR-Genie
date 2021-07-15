import { Message, MessageEmbed } from 'discord.js';
import { table } from 'table';
import utils from './messageUtils.js';

class StaticEmbeds extends Message {

    /**
     * Embed pages generator (static)
     * @param {Array} arr
     * @param {*} user
     * @param {Array} args
     * @param {Number} startIndex
     */
    constructor(message, arr, user, args) {
        super();
        this.message = message;
        this.arr = arr;
        this.user = user;
        this.footer = '';
        this.pageNumber = '';
        this.args = args;
    }

    generateEmbed(type, description) {
        const generateEmbed = (start) => {
            const current = this.arr.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${this.message.author.username}`, this.message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(this.user ? `${this.user.username}'s ${type}` : `${type}`)
                .setDescription(`${description} ${start + 1}-${start + current.length} out of ${this.arr.length}`)
                .setFooter(this.footer);
            current.forEach(g => embed.addField('\u200b', g));
            return embed;
        };
        if (this.arr.length < 10) {
            this.footer = '1 out of 1';
            this.message.channel.send(generateEmbed(0));
            return;
        }

        const page = this.args.shift();
        if (!page) {
            const lastPage = Math.ceil(this.arr.length / 10);
            this.footer = `1 out of ${lastPage}`;
            this.message.channel.send(generateEmbed(0));
        } else {
            const lastPage = Math.ceil(this.arr.length / 10);
            this.footer = `${page} out of ${lastPage}`;
            this.pageNumber = page - 1;
            const currentindex = parseInt(this.pageNumber * 10);
            console.log(currentindex);
            if (currentindex > this.arr.length) return;
            this.message.channel.send(generateEmbed(currentindex));
        }
    }

    async tableParser() {
        const sortByCash = this.message.content.includes('--cash');
        const generateEmbed = async(start) => {
            const current = this.arr.slice(start, start + 10);
            const embed = new MessageEmbed()
                .setAuthor(`Requested by ${this.message.author.username}`, this.message.author.displayAvatarURL({ dynamic: true }))
                // .setTitle(this.user ? `${this.user.username}'s ${type}` : `${type}`)
                // .setDescription(`${description} ${start + 1}-${start + current.length} out of ${this.arr.length}`)
                .setFooter(this.footer);
            const lbUsers = [];
            for (const i of current) {
                console.log('loop');
                const index = current.indexOf(i);
                const bankBal = i.balance.wallet + (sortByCash ? 0 : i.balance.bank);
                const user = await utils.getID(i.id);
                lbUsers.push([index + 1, `${user.tag}`, `${bankBal}`]);
            }
            lbUsers.unshift(['', 'KR Leaderboard', '']);
            const dat = table(lbUsers);
            embed.setDescription(`\`\`\`${dat}\`\`\``);
            console.log(dat);

            return embed;
        };
        if (this.arr.length < 10) {
            this.footer = '1 out of 1';
            this.message.channel.send('Generating tables').then(async msg => {
                this.message.channel.send(await generateEmbed(0));
                msg.delete();
            });
            return;
        }

        const page = this.args.shift();
        if (!page) {
            const lastPage = Math.ceil(this.arr.length / 10);
            this.footer = `1 out of ${lastPage}`;
            this.message.channel.send('Generating tables').then(async msg => {
                this.message.channel.send(await generateEmbed(0));
                msg.delete();
            });
        } else {
            const lastPage = Math.ceil(this.arr.length / 10);
            this.footer = `${page} out of ${lastPage}`;
            this.pageNumber = page - 1;
            const currentindex = parseInt(this.pageNumber * 10);
            console.log(currentindex);
            if (currentindex > this.arr.length) return;
            this.message.channel.send('Generating tables').then(async msg => {
                this.message.channel.send(await generateEmbed(currentindex));
                msg.delete();
            });
        }
    }

}

Message.prototype.staticEmbeds = StaticEmbeds;
export default StaticEmbeds;

