import { EventEmitter } from 'events';
// eslint-disable-next-line no-unused-vars
import { Client, TextChannel, MessageEmbed } from 'discord.js';

const emojis = {
    'start': '⏪',
    'previous': '◀️',
    'stop': '⏹️',
    'next': '▶️',
    'end': '⏩',
};

class Paginator extends EventEmitter {

    /**
     * @param  {Client} client
     * @param  {TextChannel} channel
     * @param  {Object} options must have current, max values, count optional
     * @param  {Function} handler must return Promise. Arguments are (currentIndex)
     */
    constructor(client, channel, options = { page: 1, count: 10, embed: {
        color: 'GOLD',
    } }, handler) {
        super();
        this.options = options;
        this.client = client;
        this.channel = channel;
        this.views = new Array();
        this.generator = handler;
        this.page = options.page;
        this.max = options.max;
        this.filter = options.author ? (r, u) => u.id == options.author.id : (r, u) => !u.bot;
    }

    async start() {
        this.embed = new MessageEmbed(this.options.embed);
        await this.send();
        await Promise.all(Object.values(emojis).map(x => this.message.react(x)));
        this.reactionCollector = this.message.createReactionCollector(this.filter, {
            time: 120 * 1000,
            idle: 30 * 1000,
            dispose: true,
            ...this.options.reaction,
        });
        this.reactionCollector.on('collect', this.handleReaction.bind(this));
        this.reactionCollector.once('end', () => {
            // if (this.message.editable) this.message.edit();
            this.message.reactions.removeAll();
            this.reactionCollector = null;
        });
    }

    async generate() {
        console.log(this.page);
        this.embed.setFooter(`Page: ${this.page} ${this.options.max ? '/' + this.options.max : ''}`);
        this.embed.setDescription(await this.generator((this.page - 1) * this.options.count, this.page == this.max ? this.options.maxValues % 10 : this.options.count));
        return this.embed;
    }

    async send() {
        this.embed = await this.generate();
        if (this.message && this.message?.editable)
            this.message.edit(this.embed);
        else
            this.message = await this.channel.send(this.embed);
    }

    handleReaction(reaction, user) {
        switch (reaction.emoji.name) {
        case emojis.start: {
            this.page = 1;
            break;
        }

        case emojis.previous: {
            this.page = (this.page - 1 <= 0) ? 1 : this.page - 1;
            break;
        }

        case emojis.stop: {
            return this.reactionCollector.stop();
        }

        case emojis.next: {
            console.log(this.page, this.max);
            this.page = (this.page + 1) >= this.max ? this.max : this.page + 1;
            break;
        }

        case emojis.end: {
            this.page = this.max;
            break;
        }
        }

        this.send();
        reaction.users.remove(user.id);
    }

}


export default Paginator;
