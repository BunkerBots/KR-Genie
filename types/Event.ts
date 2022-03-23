import Client from "../modules/Client";
import { Message } from "./Message";

interface Event {
    name: string;
    execute: (bot: Client, ...args: any[]) => Promise<any>;
}

type EventPayload = {
    name: string;
    execute: (bot: Client, ...args: any[]) => Promise<any>;
}

export type { Event, EventPayload };