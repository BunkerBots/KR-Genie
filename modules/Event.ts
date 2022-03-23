import type { Event as IEvent, EventPayload } from '../types/Event';
import type { Client } from '../types/Client';

interface Event extends IEvent { };

class Event {
    constructor(options: EventPayload) {
        this.name = options.name;

        this.execute = options.execute;
    }

    static async ready(bot: Client) {

        console.log(`Logged in as ${bot.user.tag}`);

        bot.user.setPresence({ activities: [{ name: 'Parallel Server', type: 'WATCHING' }], status: 'idle' });

        process.on('unhandledRejection', (e) => console.error(`promise rejection: ${e}`));
    }
}


export default Event;