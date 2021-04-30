const { prefix } = require('../../data').core;
const { devs } = require('../../data');
module.exports = {
    name: 'eval',
    dev: true,
    execute: async(message) => {
        if (!devs.includes(message.author.id)) return;
        try {
            let script = message.content.replace(`${prefix}eval `, '');
            if (script.includes('await')) script = `(async() => {${script}})()`;
            console.log(script);
            let evaled = await eval(script);
            if (typeof evaled !== 'string')
                evaled = require('util').inspect(evaled);
            console.log(clean(evaled));
            message.channel.send(clean(evaled), { code: 'xl' });
        } catch (e) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(require('util').inspect(e))}\n\`\`\``);
        }
    },
};

const clean = text => {
    if (typeof text === 'string')
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)).substring(0, 1800);
    else
        return text;
};
