require('colors')
/**
 * @param {string} message
 */

module.exports.info = function (message = ' ') {
    console.info (`=== ${message.green} ===`)
}