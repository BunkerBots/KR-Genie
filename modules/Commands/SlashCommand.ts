import { ChatInputApplicationCommandData, ApplicationCommand, ApplicationCommandData, Formatters, Permissions, CommandInteraction, ApplicationCommandDataResolvable } from 'discord.js';
import type { SlashCommand as ISC, SlashCommandPayload } from '../../types/Command';
import type { Client } from '../../types/Client';
import Command from './Command';
import CommandTypes from './CommandTypes';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

interface SlashCommand extends ISC { };

class SlashCommand extends Command {
    constructor(options: SlashCommandPayload) {
        super(options);
        this.execute = options.execute;
        this.data = options.data.toJSON();
        this.type = CommandTypes.SLASH;
    }

    async run(interaction: CommandInteraction) {
        if (this.dev && !this.checkIfDev(interaction)) return;
        if (this.required.length != 0 && !this.checkBotPermission(interaction)) {
            console.log(`At ${this.name}.ts missing permissions, required: ${this.required}`)
            return interaction.reply({
                content: `Missing Bot Permission(s) | ${Formatters.inlineCode(this.required.reduce((a, c) => new Permissions(c).toArray().concat(a), []).join(', ').trim())}`,
                ephemeral: true
            })
        }

        await this.execute(interaction);
    }

    static async sync(client: Client, commands: ISC['data'][], options: { guildId: string | null }) {
        const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

        try {
            console.log(`Started refreshing ${options.guildId ? 'guild' : 'global'} application (/) commands.`);
    
            await rest.put(
                options.guildId ? 
                Routes.applicationGuildCommands(client.user.id, options.guildId) :
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
    
            console.log(`Successfully reloaded ${options.guildId ? 'guild' : 'global'} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }

    }

    // static async sync(client: Client, commands: ISC['data'][], options: { guildId: string | null }) {
    //     console.log('at sync')
    //     // const ready = client.readyAt ? Promise.resolve() : new Promise(resolve => client.once('ready', resolve));
    //     // await ready;
    //     const currentCommands = options.guildId ? await client.application!.commands.fetch({
    //         guildId: options.guildId,
    //     }) : await client.application!.commands.fetch();

    //     console.log(currentCommands)

    //     console.log(`Synchronizing commands...`);

    //     const newCommands = commands.filter((command) => !currentCommands.some((c) => c.name === command.name));
    //     for (let newCommand of newCommands) {
    //         if (options.guildId) await client.application.commands.create(newCommand, options.guildId);
    //         else await client.application.commands.create(newCommand).catch(console.error);

    //     }

    //     console.log(`Created ${newCommands.length} commands!`);

    //     const deletedCommands = currentCommands.filter((command) => !commands.some((c) => c.name === command.name)).toJSON();
    //     for (let deletedCommand of deletedCommands) {
    //         await deletedCommand.delete();
    //     }

    //     console.log(`Deleted ${deletedCommands.length} commands!`);

    //     const updatedCommands = commands.filter((command) => currentCommands.some((c) => c.name === command.name));
    //     let updatedCommandCount = 0;
    //     for (let updatedCommand of updatedCommands) {
    //         const newCommand = updatedCommand;
    //         const previousCommand = currentCommands.find((c) => c.name === updatedCommand.name);
    //         let modified = false;
    //         // if (previousCommand!.description !== newCommand.description) modified = true;
    //         if (!ApplicationCommand.optionsEqual(previousCommand!.options ?? [], newCommand.options ?? [])) modified = true;
    //         if (modified) {
    //             await previousCommand!.edit(newCommand as unknown as ApplicationCommandData);
    //             updatedCommandCount++;
    //         }
    //     }

    //     console.log(`Updated ${updatedCommandCount} commands!`);

    //     console.log(`Commands synchronized!`);

    // }
}

export default SlashCommand;