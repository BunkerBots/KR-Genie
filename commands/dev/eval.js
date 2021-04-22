const { prefix } = require('../../data').core;
const { devs } = require('../../data');
const db = require('../../modules');
module.exports = {
    name: 'eval',
    execute: async(message) => {
        if (!devs.includes(message.author.id)) return;
        try {
            let script = message.content.replace(`${prefix}eval `, '');
            if (script.includes('await')) script = `(async() => {${script}})()`;
            console.log(script);
            let evaled = await eval(script);
            if (typeof evaled !== 'string')
                evaled = require('util').inspect(evaled);

            message.channel.send(clean(evaled), { code: 'xl' });
        } catch (e) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(e)}\n\`\`\``);
        }
    },
};

const clean = text => {
    if (typeof text === 'string')
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    else
        return text;
};
