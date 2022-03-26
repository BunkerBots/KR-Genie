import { Interaction } from "discord.js"
import Event from '../modules/Event';
import SlashCommand from "../modules/Commands/SlashCommand";
import economyDB from "../modules/db/economy";

export default new Event({
    name: 'interactionCreate',
    execute: async (bot, i: Interaction) => {
        if (i.isCommand()) {
            const command: SlashCommand = bot.slashcommands.get(i.commandName);
            if (command.guildOnly && !i.guild) return;
            if (!command) return i.reply({
                content: 'Unknown command',
                ephemeral: true
            });

            const cooldowns = await economyDB.getCooldown(i.user.id);

            if (!cooldowns[i.commandName]) {
                command.run(i);
                await economyDB.setCooldown(i.user.id, i.commandName);
            } else {
                const time = cooldowns[i.commandName] + (bot.slashcommands.get(i.commandName).cooldown || 0);

                if (Date.now() < time)
                    return i.reply({ content: 'Cooldown', ephemeral: true });
                else {
                    command.run(i);
                    await economyDB.deleteCooldown(i.user.id, i.commandName);
                }
            }
            // if (!cooldowns[i.commandName]) {
            //     command.run(i);
            //     await economyDB.setCooldown(i.user.id, i.commandName);
            // } else {
            //     const time = cooldowns[i.commandName] + (bot.slashcommands.get(i.commandName).cooldown || 0);

            //     if (Date.now() < time)
            //         return i.reply({ content: 'Cooldown', ephemeral: true });
            //     else {
            //         await economyDB.deleteCooldown(i.user.id, i.commandName);
            //         command.run(i);
            //     }
            // }
            // command.run(i);
        }
    }
})