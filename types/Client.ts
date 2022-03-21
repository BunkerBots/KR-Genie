import { Collection, Client as dClient } from "discord.js";
import MessageCommand from "../modules/Commands/MessageCommand";
import SlashCommand from "../modules/Commands/SlashCommand";

interface Client extends dClient {
    messagecommands: Collection<string, MessageCommand>;
    slashcommands: Collection<string, SlashCommand>;
    prefix: string;
    cooldowns: Collection<string, Collection<string, number>>;
    maintenance: boolean;
}

export type { Client };