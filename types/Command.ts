import { Message, Client, Interaction, CommandInteraction } from 'discord.js';
import CommandTypes from '../modules/Commands/CommandTypes';
import type { Message as IMessage } from './Message';

type allowPayload = {
    permissions?: number[];
    roles?: string[];
    ids?: string[]
}

type allow = {
    permissions: number[];
    roles: string[];
    ids: string[];
}

interface CommandPayload {
    name: string;
    description?: string;
    expectedArgs?: string;
    cooldown?: number;
    aliases?: string[];
    allow?: allowPayload;
    required?: bigint[];
    dev?: boolean;
    guildOnly?: boolean;
}

interface Command {
    name: string;
    description: string;
    expectedArgs: string;
    cooldown: number;
    aliases: string[];
    allow: allow;
    required: bigint[];
    dev: boolean;
    guildOnly: boolean;
}

interface MessageCommandPayload extends CommandPayload {
    execute: (message: IMessage, args: string[], bot: Client) => Promise<any>;
}

interface SlashCommandPayload extends CommandPayload {
    execute: (interaction: CommandInteraction) => Promise<any>;
}


interface MessageCommand extends Command {
    type: CommandTypes.MESSAGE;
    execute: (message: IMessage, args: string[], bot: Client) => Promise<any>;
}

interface SlashCommand extends Command {
    type: CommandTypes.SLASH;
    execute: (interaction: CommandInteraction) => Promise<any>;
}

export type { Command, allow, CommandPayload, allowPayload, MessageCommand, SlashCommand, MessageCommandPayload, SlashCommandPayload }