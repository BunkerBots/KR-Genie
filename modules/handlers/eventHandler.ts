import fs from 'fs';
import Client from '../Client';
import type { Event } from '../../types/Event';

async function handleEvents(bot: Client, dir: { absolutePath: string, path: string, name: string }) {
    const eventsFolder = fs.readdirSync(dir.absolutePath).filter(x => x.endsWith('.ts'));
    for (const file of eventsFolder) {
        let _event = await import(`../../${dir.path}/${file}`);
        let event: Event = _event.default;
        bot.on(event.name.toString(), event.execute.bind(null, bot));
        console.log('[event handler]', `${event.name}`);
    }
}

export default handleEvents;