const { EventEmitter } = require('events');
// eslint-disable-next-line no-unused-vars
const { Client, TextChannel, MessageEmbed } = require('discord.js');

const emojis = {
    'next': '▶️',
    'previous': '◀️',
    'start': '⏪',
    'end': '⏩',
    'stop': '⏹️',
};

class Paginator extends EventEmitter {

    /**
     * @param  {Client} client
     * @param  {TextChannel} channel
     * @param  {Object} options must have current, max values, count optional
     * @param  {Function} handler must return Promise. Arguments are (currentIndex)
     */
    constructor(client, channel, options = { count: 10, embed: {
        color: 'GOLD',
    } }, handler) {
        super();
        this.options = options;
        this.client = client;
        this.channel = channel;
        this.views = new Array();
        this.generator = handler;
        this.filter = options.author ? (r, u) => u.id == options.author.id : (r, u) => !u.bot;
    }

    async start() {
        this.embed = new MessageEmbed(this.options.embed);
        this.message = await this.channel.send(this.embed);
        await Promise.all(emojis.map(x => this.message.react(x)));
        this.reactionCollector = this.message.createReactionCollector(this.filter, {
            time: 120 * 1000,
            idle: 30 * 1000,
            dispose: true,
            ...this.options.reaction,
        });
        this.reactionCollector.on('collect', this.handleReaction);
        this.reactionCollector.once('end', () => {
            // if (this.message.editable) this.message.edit();
            this.message.reactions.removeAll();
            this.reactionCollector = null;
        });
    }

    handleReaction(reaction, user) {
        // TODO
    }

}

class cacheableView {

    constructor() {

    }

}


module.expors = Paginator;