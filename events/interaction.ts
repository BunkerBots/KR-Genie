import { Interaction } from "discord.js"
import Event from '../modules/Event';
import SlashCommand from "../modules/Commands/SlashCommand";

export default new Event({
    name: 'interactionCreate',
    execute: async (bot, i: Interaction) => {
        if (i.isCommand()) {
            const command: SlashCommand = bot.slashcommands.get(i.commandName);
            if (command.guildOnly && !i.guild) return;
            if (!command) return i.reply({
                content: 'Unknown command',
                ephemeral: true
            })

            command.run(i);
        }
    }
})