import { EventEmitter } from 'events';
// eslint-disable-next-line no-unused-vars
import { Client, TextChannel, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import { disableComponents } from './messageUtils.js';
const emojis = {
    'previous': ':previous:871393934125965403',
    'stop': ':close:871392556372623360',
    'next': ':next:871393934096601088',
    'to_start': ':to_start:871394394564075580',
    'goto': ':goto:871394282869764096',
    'to_end': ':to_end:871393933664596040',
};
import delay from 'delay';

class Paginator extends EventEmitter {

    /**
     * @param  {Client} client
     * @param  {TextChannel} channel
     * @param  {Object} options must have current, max values, count optional
     * @param  {Function} handler must return Promise. Arguments are (currentIndex)
     */
    constructor(client, channel, options = { page: 1, count: 10 }, handler) {
        super();
        this.options = options;
        this.options.count ||= 10;
        this.options.page ||= 1;
        this.client = client;
        this.channel = channel;
        this.views = new Array();
        this.generator = handler;
        this.page = options.page || 1;
        this.max = options.max;
        this.filter = options.author ? (i) => {
            return i.user.id == options.author.id;
        } : (i) => !i.user.bot;
    }

    async start() {
        this.buttons = generateButtons();
        await this.send();
        this.collector = this.message.createMessageComponentCollector({
            time: 120 * 1000,
            idle: 30 * 1000,
            dispose: true,
        });
        this.collector.on('collect', this.handleInteraction.bind(this));
        this.collector.once('end', async() => {
            // if (this.message.editable) this.message.edit();
            await disableComponents(this.message);
            this.collector = null;
        });
    }

    async generate() {
        const opts = await this.generator((this.page - 1) * this.options.count, this);
        opts.components ||= generateButtons();
        return opts;
    }

    async send() {
        this.opts = await this.generate();
        if (this.message && this.message?.editable)
            this.message.edit(this.opts);
        else
            this.message = await this.channel.send(this.opts);
    }

    async handleInteraction(interaction) {
        const reply = this.filter(interaction);
        if (!reply)
            return interaction.reply({ content: `You can't use the controls of a command issued by another user!\n Current Command issued by: <@${interaction.user.id}>`, ephemeral: true });
        interaction.deferReply();
        switch (interaction.customId.split(':')[1]) {
        case 'to_start': {
            this.page = 1;
            break;
        }

        case 'previous': {
            this.page = (this.page - 1 <= 0) ? 1 : this.page - 1;
            break;
        }

        case 'stop': {
            await this.collector.stop();
            await interaction.deleteReply();
            return;
        }

        case 'next': {
            this.page = (this.page + 1) >= this.max ? this.max : this.page + 1;
            break;
        }

        case 'to_end': {
            this.page = this.max;
            break;
        }
        case 'goto': {
            const replyMessage = await interaction.message.reply({ content: 'Send the page number you wish to goto', ephemeral: true });
            const messages = await interaction.channel.awaitMessages({ filter: (msg) => msg.author.id == this.options.author.id, max: 1, time: 10000 })
                .catch(() => {
                    interaction.message.reply({ content: 'Timed Out! Try again..' }).then(x => delay(5000).then(x.delete));
                });
            replyMessage.delete().catch(console.error);
            if (!messages?.size) return;
            const msg = messages.first();
            let page = Number(msg.content);
            if (!msg) return interaction.message.reply({ content: `Invalid Page: ${msg.content} :/` }).then(x => delay(5000).then(x.delete));
            page = page >= this.max ? this.max : page;
            if (page <= 0) page = this.max + page;
            this.page = page;
            break;
        }

        default: {
            console.error('UNKNOWN ID', interaction.customId, interaction.customId.split(':'));
        }
        }
        await this.send(interaction);
        await interaction.deleteReply();
    }

}

function generateButtons() {
    const row1 = new MessageActionRow();
    const row2 = new MessageActionRow();
    const buttons = Object.entries(emojis).map(([k, x]) => {
        return new MessageButton().setStyle('SECONDARY').setCustomId(`PAGINATOR:${k}`).setEmoji(x);
    });

    row1.addComponents(buttons.splice(0, 5));
    row2.addComponents(buttons);

    return [row1, row2];
}

// eslint-disable-next-line no-unused-vars
function getSpaced(x) {
    if (x.length <= 5) return `\u2000\u2000\u2000${x}\u2000\u2000\u2000`;
    return `\u2000${x}\u2000\u2000`;
}


export default Paginator;
