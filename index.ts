import { Intents } from 'discord.js';
import Client from './modules/Client';
import handleCommands from './modules/handlers/commandHandler';
import handleEvents from './modules/handlers/eventHandler';
import { config } from 'dotenv';

config();

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES],
    bot = new Client('.', { intents: intents });


(async function() {
    await handleEvents(bot, {
        absolutePath: `./events`,
        path: 'events',
        name: 'KRGenie'
    });

    bot.once('ready', async() => {
        await handleCommands(bot, { 
            absolutePath: `./_cmd`, 
            path: '_cmd',
            name: 'KRGenie'
        });
    })
    
    bot.login(process.env.TOKEN);
})();