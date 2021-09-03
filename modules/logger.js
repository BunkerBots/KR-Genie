import { MessageEmbed } from 'discord.js';
import { id, core } from '../data/index.js';
import util from 'util';
import 'colors';


let LogChannel;

/**
 * Logging core functionalities
 * @param {String}  logMessage  The message to be logged
 */
function info(logMessage = ' ') {
    console.info(`=== ${logMessage.green} ===`);
}

/**
 * Advanced logging
 * @param {String}  functonName The name of the function to be logged
 * @param {String}  logMessage  The message to be logged
 */
function debug(functionName = ' ', logMessage = ' ') {
    console.info(`>>> ${functionName.blue} | ${logMessage.yellow} <<<`);
}

/**
 * Error logging
 * @param {String}  functonName     The name of the function calling an error
 * @param {String}  errorMessage    The error message to be logged
 */

let error = function(functionName = ' ', errorMessage = ' ') {
    console.error(`!!! ${functionName} | ${errorMessage} !!!`.red);
};

/**
 * Unhandled Error logging
 * @param  {Error} error
 */
function unhandledError(e) {
    error('Unhandled Error', util.inspect(e));
}

let commandsLogChannel;
let KBlogs;

async function init(bot) {
    commandsLogChannel = await bot.channels.fetch(id.channels['commands-log']);
    KBlogs = process.env.NODE_ENV == 'PRODUCTION' ? await bot.channels.fetch(id.channels['kb-commands-log']).catch(() => {}) : undefined;
    LogChannel = await bot.channels.fetch(id.channels['crash-logs']);
    error = (functionName = ' ', errorMessage = ' ') => {
        console.error(`!!! ${functionName} | ${errorMessage} !!!`.red);
        return LogChannel.send({ content: `**${functionName}**\n\`\`\`js\n${errorMessage}\`\`\` ` });
    };
    return true;
}

const commandsLog = async(user, commandName, comment, guild, args, type) => {
    const embed = new MessageEmbed()
        .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
        .setTitle(commandName)
        .setColor(core.embed)
        .setDescription(`${comment || ''}\`\`\`yaml\nGuild: ${guild.name || ''}\nArguments: ${args || 'null'}\n${type || 0}\`\`\``)
        .setTimestamp();
    commandsLogChannel?.send({ embeds: [embed] });
    KBlogs?.send({ embeds: [embed] });
};


const logCmdName = (name) => {
    const str = `\`\`\`js\n${name}.js\`\`\``;
    LogChannel.send({ embeds: [new MessageEmbed().setDescription(str)] });
};
export default { logCmdName, error, commandsLog, info, unhandledError, debug, init };
export { logCmdName, error, commandsLog, info, unhandledError, debug, init };
