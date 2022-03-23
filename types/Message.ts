import { GuildMember, User, Message as dMessage, MessageEmbed, ButtonInteraction, ColorResolvable } from 'discord.js';

type sendEmbedPayload = { color?: ColorResolvable, description: string, footer?: string, author?: User, fields?: [string, string, boolean] };

interface Message extends dMessage {
    getUser: (id: string) => Promise<User | null>;
    getMember: (id: string) => Promise<GuildMember | null>;
    sendEmbed: (payload: sendEmbedPayload) => Promise<Message>;
    replyEmbed: (payload: sendEmbedPayload) => Promise<Message>;
    createEmbed: (payload: sendEmbedPayload) => MessageEmbed;
    handleInteraction: (interaction: ButtonInteraction, userId?: string) => boolean;
    sendEmbedDM: (payload: sendEmbedPayload) => Promise<null | Message>
    disableComponents: () => void;
}

export type { Message };