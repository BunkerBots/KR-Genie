import fs, { existsSync } from 'fs';
import type { SlashCommand as ISC } from '../../types/Command';
import Client from '../Client';
import CommandTypes from '../Commands/CommandTypes';
import MessageCommand from '../Commands/MessageCommand';
import SlashCommand from '../Commands/SlashCommand';

const commandsData: ISC['data'][] = [];

async function read(bot: Client, path: string) {
    const commandFolders = fs.readdirSync(`./${path}`);
    if (commandFolders.length == 0 || commandFolders.includes('.ignore')) return;

    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./${path}/${folder}`).filter(file => file.endsWith('.ts'));
        for (const file of commandFiles) {
            let command: MessageCommand | SlashCommand = (await import(`../../${path}/${folder}/${file}`)).default;
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
}

async function handleCommands(bot: Client) {

    const rootDir = fs.readdirSync('./').filter(file => file.toLowerCase().includes('command'));
    if (rootDir.length == 0) return console.error('Missing commands dir');

    for (let i = 0; i < rootDir.length; i++)
        await read(bot, rootDir[i]);


    const dev = process.env.NODE_ENV == 'DEV';

    if (commandsData.length !== 0) {
        await SlashCommand.sync(bot, commandsData, { guildId: dev ? '678746487508828180' : null });
    }

}

export default handleCommands;