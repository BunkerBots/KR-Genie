import Event from "../modules/Event";

export default new Event({
    name: 'ready',
    execute: async(bot) => {
        console.log(`Logged in as ${bot.user.tag}`);

        bot.user.setPresence({ activities: [{ name: 'Parallel Server', type: 'WATCHING' }], status: 'idle' });

        process.on('unhandledRejection', (e) => console.error(`promise rejection: ${e}`));
    }
})