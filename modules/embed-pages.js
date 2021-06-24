import { Message, MessageEmbed } from 'discord.js';


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

}

Message.prototype.staticEmbeds = StaticEmbeds;
export default StaticEmbeds;

