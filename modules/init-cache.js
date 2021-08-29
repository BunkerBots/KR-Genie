const init = () => {
    global.cache.create('usernames');
    global.logger.debug('cache created', 'usernames');
    global.cache.create('tags');
    global.logger.debug('cache created', 'tags');
};

export default init;
