const { Message } = require('discord.js');

const mentionRegex = /<?@?!?(\d{17,19})>?/g
/**
 * @param {Optional String} String to check for mentions in
 * @returns {Array(User ID)} Returns an array of User IDs, which are mentioned or are in the content
 */
Message.prototype.getMentions = function (args) {
    console.log(this.content.match(mentionRegex));
    return args ? args.match(mentionRegex) : this.content.match(mentionRegex);
}
