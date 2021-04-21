const data = require('../../data');
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'slots',
    aliases: [],
    execute: async (message, args) => {
        if (!data.betaTesters.testers.includes(message.author.id)) return
        const { wallet } = await data.economy.balance(message.author.id)
        if (!args[1]) return message.reply('You need to bet something...')
        let KR;
        if (args[1].toLowerCase() === 'all') KR = parseInt(wallet)
        else KR = parseInt(args[1])
        if (KR > wallet) return message.reply(`You do not have ${data.emotes.kr}${KR} in your wallet`)
        if (wallet <= 0) return message.reply('You can\'t bet thin air')
        const partnerEmote = data.emotes.partner
        const verifiedEmote = data.emotes.verified
        const premiumEmote = data.emotes.premium
        const krunkieEmote = data.emotes['krunkie-spin']
        const emotes = [partnerEmote, verifiedEmote, premiumEmote, krunkieEmote]
        var obj1 = emotes[Math.floor(Math.random() * emotes.length)];
        var obj2 = emotes[Math.floor(Math.random() * emotes.length)];
        var obj3 = emotes[Math.floor(Math.random() * emotes.length)];
        var obj4 = emotes[Math.floor(Math.random() * emotes.length)];
        var obj5 = emotes[Math.floor(Math.random() * emotes.length)];
        var obj6 = emotes[Math.floor(Math.random() * emotes.length)];
        var obj7 = emotes[Math.floor(Math.random() * emotes.length)];
        var obj8 = emotes[Math.floor(Math.random() * emotes.length)];
        var obj9 = emotes[Math.floor(Math.random() * emotes.length)];

        if (obj1 == obj2 == obj3 || 
            obj4 == obj5 == obj6 ||
            obj7 == obj8 == obj9 ||
            obj1 == obj4 == obj7 ||
            obj2 == obj5 == obj8 ||
            obj3 == obj6 == obj9){
                const embed = new MessageEmbed()
                .setAuthor(message.author.username , message.author.displayAvatarURL({dynamic: false}))
                .setTitle(`You won! 5x ${data.emotes.kr}${KR}`)
                .setDescription(`${obj1} ${obj2} ${obj3}\n${obj4} ${obj5} ${obj6}\n${obj7} ${obj8} ${obj9}`)
                .setColor('GREEN')
                await data.economy.addKR(message.author.id , KR)
                message.channel.send(embed)
            } else {
                const embed = new MessageEmbed()
                await data.economy.addKR(message.author.id, -KR)
                .setAuthor(message.author.username , message.author.displayAvatarURL({dynamic: false}))
                .setTitle(`You lost!`)
                .setDescription(`${obj1} ${obj2} ${obj3}\n${obj4} ${obj5} ${obj6}\n${obj7} ${obj8} ${obj9}`)
                .setColor('RED')
                message.channel.send(embed)
            }
    }
}