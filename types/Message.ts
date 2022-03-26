import { EmbedAuthorData, GuildMember, User, Message as dMessage, MessageEmbed, ButtonInteraction, ColorResolvable } from 'discord.js';

type sendEmbedPayload = { color?: ColorResolvable, description: string, footer?: string, author?: User, fields?: [string, string, boolean] };

type embedPayload = { title?: string, author?: EmbedAuthorData, description: string, color?: ColorResolvable, footer?: string, fields?: { name: string, value: string, inline: boolean }[], timestamp?: boolean };

interface Message extends dMessage {
    getUser: (id: string) => Promise<User | null>;
    getMember: (id: string) => Promise<GuildMember | null>;
    sendEmbed: (payload: embedPayload) => Promise<Message>;
    replyEmbed: (payload: embedPayload) => Promise<Message>;
    createEmbed: (payload: embedPayload) => MessageEmbed;
    handleInteraction: (interaction: ButtonInteraction, userId?: string) => boolean;
    sendEmbedDM: (payload: embedPayload) => Promise<null | Message>
    disableComponents: () => void;
}

export type { Message, embedPayload };