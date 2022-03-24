import fs, { existsSync } from 'fs';
import type { SlashCommand as ISC } from '../../types/Command';
import Client from '../Client';
import CommandTypes from '../Commands/CommandTypes';
import MessageCommand from '../Commands/MessageCommand';
import SlashCommand from '../Commands/SlashCommand';



async function handleCommands(bot: Client, dir: { absolutePath: string, path: string, name: string }) {

    if (!existsSync(dir.absolutePath)) return;

    const commandFolders = fs.readdirSync(dir.absolutePath);

    if (commandFolders.length == 0) return;

    const commandsData: ISC['data'][] = [];
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`${dir.absolutePath}/${folder}`).filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
            let command: MessageCommand | SlashCommand = (await import(`../../${dir.path}/${folder}/${file}`)).default;
            // command.module = folder;
            if (command.type == CommandTypes.MESSAGE) {
                (bot as Client).messagecommands.set(command.name, command);
                console.log('[command handler] [message command]', `${command.name}.js`);
            } else if (command.type == CommandTypes.SLASH) {
                commandsData.push(command.data);
                (bot as Client).slashcommands.set(command.name, command);
                console.log('[command handler] [slash command]', `${command.name}.js`);
            }
        }
    }

    const dev = process.env.NODE_ENV == 'DEV';

    await SlashCommand.sync(bot, commandsData, { guildId: dev ? '678746487508828180' : null });
}

export default handleCommands;