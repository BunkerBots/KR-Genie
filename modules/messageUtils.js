const { Message } = require('discord.js');

Message.prototype.bind(getMentions)
const mentionRegex = /<?@?!?(\d{17,19})>?/g
/**
 * @param {Optional String} String to check for mentions in
 * @returns {Array(User ID)} Returns an array of User IDs, which are mentioned or are in the content
 */
const getMentions = (args) =>  {
    console.log(this);
    return args ? args.match(mentionRegex) : this.content.match(mentionRegex);
}
Message.prototype.getMentions = getMentions;
