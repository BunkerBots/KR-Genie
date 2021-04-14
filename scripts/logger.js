const id = require('../JSON/id.json')
let LogChannel;
require('colors')
/**
 * Logging core functionalities
 * @param {String}  logMessage  The message to be logged
 */

module.exports.info = function (logMessage = ' ') {
        console.info(`=== ${logMessage.green} ===`);
};

/**
 * Advanced logging
 * @param {String}  functonName The name of the function to be logged
 * @param {String}  logMessage  The message to be logged
 */
module.exports.debug = function (functionName = ' ', logMessage = ' ') {
    console.info(`>>> ${functionName.blue} | ${logMessage.yellow} <<<`);
};

/**
 * Error logging
 * @param {String}  functonName     The name of the function calling an error
 * @param {String}  errorMessage    The error message to be logged
 */

module.exports.error = function (functionName = ' ', errorMessage = ' ') {
    console.error(`!!! ${functionName} | ${errorMessage} !!!`.red);
};

/**
 * Unhandled Error logging
 * @param  {Error} error
 */
module.exports.unhandledError = function (e) {
    module.exports.error('Unhandled Error', require('util').inspect(e));
};

module.exports.init = async function(bot) {
    LogChannel = await bot.channels.fetch(id.channels['crash-logs']);
        const error = (functionName = ' ', errorMessage = ' ') => {
            console.error(`!!! ${functionName} | ${errorMessage} !!!`.red);
            return LogChannel.send(`**${functionName}**\n\`\`\`js\n${errorMessage}\`\`\` `);
        };
        module.exports.error = error;
    return true;
};