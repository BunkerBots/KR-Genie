import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js';
import { core } from '../../data/index.js';
import { createEmbed, disableComponents } from '../../modules/messageUtils.js';
import fs from 'fs';


const menuOptions = [{
    label: 'Profile',
    description: 'Contains all commands associated with account setup and inventory',
    value: 'profile',
},
{
    label: 'Game',
    description: 'Mini-Games in this bot along with proper usage',
    value: 'games',
},
{
    label: 'Economy',
    description: 'The core commands of this bot',
    value: 'economy',
},
{
    label: 'Market',
    description: 'Cotains commands used for purchasing collectables, spins and more',
    value: 'market',
},
{
    label: 'Skins market',
    description: 'Cotains commands used for listing and purchasing skisn real-time',
    value: 'skins-market',
},
{
    label: 'Important',
    description: 'Commands that revolves around KR Genie\'s change logs, help etc',
    value: 'important',
}];

class Help {

    constructor(m) {
        this.message = m;
        this.dmChannel;
        this.command;
        this.res = [];
        this.subMenuOptions = [];
        this.menu;
    }

    async init() {
        const cmdembed = new MessageEmbed()
            .setAuthor(`${this.message.author.username}`, this.message.author.displayAvatarURL({ dynamic: true }))
            .setTitle('Help Window')
            .setDescription('Welcome to KR-Genie help window, please select a category from the drop down menu to proceed')
            .setColor(core.embed)
            .setTimestamp();
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('help')
                    .setMaxValues(1)
                    .setPlaceholder('Select a command category')
                    .addOptions(menuOptions),
            );
        try {
            this.dmChannel = await this.message.author.send({ components: [row], embeds: [cmdembed] });
        } catch (e) {
            return this.message.reply(createEmbed(this.message.author, 'RED', 'Please make sure you have your DMs open to recieve the bot message!'));
        }
        const successEmbed = new MessageEmbed().setColor('GREEN').setDescription(':e_mail: You have recieved a mail');
        this.message.reply({ embeds: [successEmbed] });
        const filter = i => i.user.id === this.message.author.id;
        const collector = this.dmChannel.channel.createMessageComponentCollector({ filter, componentType: 'SELECT_MENU', time: 200000, });
        collector.on('collect', async i => {
            let desc = '';
            console.log('reached');
            if (['economy', 'games', 'important', 'market', 'profile', 'skins-market'].includes(i.values[0])) {
                this.command = await this.parseModules(i.values[0]);
                const embed = new MessageEmbed()
                    .setAuthor(`${this.message.author.username}`, this.message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle(`${i.values[0]} modules`)
                    .setColor(core.embed)
                    .setTimestamp();
                for (let c = 0; c < this.command.length; c++)
                    desc += `${c + 1}. ${this.command[c].name}\n\u200b\n`;

                embed.setDescription(`\`\`\`md\n${desc}\`\`\``);
                disableComponents(this.dmChannel);
                this.menu = await this.dmChannel.reply({ embeds: [embed], components: [this.subMenu()] });

                console.log('finished');
            } else {
                const cmd = this.command.find(x => x.name == i.values[0]);
                const embed = new MessageEmbed()
                    .setAuthor(`${this.message.author.username}`, this.message.author.displayAvatarURL({ dynamic: true }))
                    .setTitle(`${i.values[0]} modules`)
                    .setColor(core.embed)
                    .setDescription(`${cmd.description}`)
                    .addField('Aliases', `${cmd.aliases}`)
                    .addField('Expected usage', `${cmd.expectedArgs}`)
                    .setFooter('This session has expired')
                    .setTimestamp();

                i.reply({ embeds: [embed] });
                disableComponents(this.menu);
            }
        });

        collector.on('end', () => console.log('timer end'));
    }

    subMenu() {
        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('help')
                    .setMaxValues(1)
                    .setPlaceholder('Select a category')
                    .addOptions(this.subMenuOptions),
            );
        return row;
    }

    async parseModules(name) {
        this.res = [];
        this.subMenuOptions = [];
        const commandFolder = fs.readdirSync(`./commands/${name}`);
        for (const files of commandFolder) {
            const file = await import(`../${name}/${files}`);
            const command = file.default;
            // res.push(command.name);
            this.res.push({ name: command.name, description: command.description, aliases: command.aliases.join(', '), expectedArgs: command.expectedArgs });
            this.subMenuOptions.push({ label: command.name, description: command.name, value: command.name });
        }
        return this.res;
    }

}


export default {
    name: 'help',
    aliases: [],
    execute: async(message) => {
        const help = new Help(message);
        help.init();
    },
};

