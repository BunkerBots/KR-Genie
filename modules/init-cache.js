const init = () => {
    global.cache.create('usernames');
    global.logger.debug('cache created', 'usernames');
    global.cache.create('tags');
    global.logger.debug('cache created', 'tags');
    global.requests = {};
    global.handleInteraction = (i, m) => {
        if (i.user.id !== m.author.id) {
            i.reply({ content: `You can't use the controls of a command issued by another user!\n Current Command issued by: <@${m.author.id}>`, ephemeral: true });
            return true;
        }
    };
};

export default init;
