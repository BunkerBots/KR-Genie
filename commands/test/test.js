// import data from '../../data/index.js';
// import fetch from 'node-fetch';
// import c from 'chartjs-node-canvas';
// import { MessageAttachment, MessageEmbed } from 'discord.js';
// const { ChartJSNodeCanvas } = c;

export default {
    name: 'ping',
    aliases: [''],
    dev: true,
    execute: async() => {
        // if (!(data.devs.includes(message.author.id) || data.staff.includes(message.author.id))) return;
        // const player = 100;
        // const opponent = 100;
        // const moves = ['kick', 'punch'];
        // const response = ['accept', 'decline'];
        // let winnerArr;
        // const balance = await db.utils.balance(message.author.id);
        // const { wallet } = await db.utils.balance(message.author.id);

        // if (!args[0]) return message.reply(utils.createEmbed(message.author, 'RED', 'SMH you can\'t 1v1 yourself , tag a user'));
        // if (!args[1]) return message.reply(utils.createEmbed(message.author, 'RED', `What are you betting? provide a valid amount of ${data.emotes.kr}`));
        // const bet = parseInt(utils.parse(args[1], balance));
        // if (wallet <= 0) return message.reply(utils.createEmbed(message.author, 'RED', 'You can\'t bet thin air'));
        // if (bet > wallet) return message.reply(utils.createEmbed(message.author, 'RED', `You do not have ${data.emotes.kr}${comma(bet)} in your wallet`));
        // if (!Number.isInteger(bet)) return message.reply(utils.createEmbed(message.author, 'RED', `Provide a valid amount of ${data.emotes.kr} smh`));
        // const member = await message.guild.members.fetch(args[0].replace(/\D/g, '')).catch(() => {});
        // if (!member)
        //     return message.reply(utils.createEmbed(message.author, 'RED', 'Unknown user'));
        // const embed = utils.createEmbed(message.author, 'GOLD', `${message.author.username} is challenging you to a ${data.emotes.kr}${comma(bet)} duel\nReply with \`accept\` to fight\nReply with \`decline\` to bail`);
        // const memberwallet = await db.utils.balance(member.id);
        // if (member.id === message.author.id) return message.reply(utils.createEmbed(message.author, 'RED', 'Sorry you can\'t 1v1 yourself...'));
        // if (member.user.bot) return message.reply(utils.createEmbed(message.author, 'RED', 'You can\'t 1v1 bots , they\'re too powerful for you'));
        // if (bet > memberwallet.wallet) return message.reply(utils.createEmbed(message.author, 'RED', `${member.user.username} does not have ${data.emotes.kr}${bet} to bet!`));
        // const msg = await message.channel.send(`<@${member.id}>`, { embed: embed });
        // const collector = message.channel.createMessageCollector(x => x.author.id == member.id);
        // const playerCollector = message.channel.createMessageCollector(x => x.author.id == message.author.id && moves.includes(x.content.toLowerCase()),
        //     { time: 10000 });
        // const opponentCollector = message.channel.createMessageCollector(x => x.author.id == member.id && moves.includes(x.content.toLowerCase()),
        //     { time: 10000 });
        // const collected = await message.channel.awaitMessages(m => m.author.id === member.id,
        //     {
        //         max: 1,
        //         time: 15000,
        //         errors: ['time'],
        //     })
        //     .catch(() => {
        //         msg.delete();
        //         message.channel.send(utils.createEmbed(message.author, 'RED', 'Match has been cancelled due to inactivity'));
        //     });
        //     // eslint-disable-next-line no-useless-return
        // if (collected.first().content.toLowerCase() == response[1]) return;
        // else if (collected.first().content.toLowerCase() == response[0]) {
        //     message.channel.send('use kick or punch');
        //     while (player > 0 && opponent > 0) {
        //         playerCollector.on('collect', () => {
        //             const hitPoints = Math.floor(Math.random() * 100);
        //             message.channel.send(`You dealt ${hitPoints} damage to ${member.user.username}`);
        //             parseInt(opponent - hitPoints);
        //             if (opponent <= 0) {
        //                 message.channe.send('player won');
        //                 winnerArr = [{ winner: member.user.username, winnerID: member.id, loserID: message.author.id }];
        //                 msg.edit(utils.createEmbed(message.author, 'GREEN', 'You won the duel!'));
        //             }
        //         });
        //         playerCollector.on('end', () => message.channel.send('time out yikes'));
        //         opponentCollector.on('collect', (recVmsg1) => {
        //             const hitPoints = Math.floor(Math.random() * 100);
        //             recVmsg1.reply(`You dealt ${hitPoints} damage to ${message.author.username}`);
        //             parseInt(player - hitPoints);
        //             if (player <= 0) {
        //                 message.channel.send('opponent has won');
        //                 winnerArr = [{ winner: message.author.username, winnerID: message.author.id, loserID: member.id }];
        //                 msg.edit(utils.createEmbed(message.author, 'RED', `${member.user.username} won the duel!`));
        //             }
        //         });
        //         opponentCollector.on('end', () => message.channel.send('time out yikes'));
        //     }
        // } else message.reply('unknown response');

        // // message.channel.send(utils.createEmbed(message.author, 'GREEN', `${winnerArr[0].winner} won the game!`));
        // // await db.utils.addKR(winnerArr[0].winnerID, bet);
        // // await db.utils.addKR(winnerArr[0].loserID, -bet);
        // let then, now, ping;

        // async function pong(url) {
        //     then = Date.now();
        //     await fetch(url, { mode: 'no-cors' });
        //     now = Date.now();
        //     ping = now - then;
        //     console.log(ping);
        //     return ping;
        // }

        // let conf;
        // const width = 400;
        // const height = 400;
        // const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

        // async function f() {
        //     const configuration = {
        //         type: 'line',
        //         data: {
        //             labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        //             datasets: [{
        //                 label: 'Krunker Ping',
        //                 data: [0, 0, 0, 0, 0, 0],
        //                 backgroundColor: [
        //                     'rgba(255, 99, 132, 0.2)',
        //                     'rgba(54, 162, 235, 0.2)',
        //                     'rgba(255, 206, 86, 0.2)',
        //                     'rgba(75, 192, 192, 0.2)',
        //                     'rgba(153, 102, 255, 0.2)',
        //                     'rgba(255, 159, 64, 0.2)'
        //                 ],
        //                 borderColor: [
        //                     'rgba(255,99,132,1)',
        //                     'rgba(54, 162, 235, 1)',
        //                     'rgba(255, 206, 86, 1)',
        //                     'rgba(75, 192, 192, 1)',
        //                     'rgba(153, 102, 255, 1)',
        //                     'rgba(255, 159, 64, 1)'
        //                 ],
        //                 borderWidth: 1
        //             }]
        //         },
        //         options: {
        //             scales: {
        //                 xAxes: {
        //                     display: false,
        //                 },
        //                 yAxes: [{
        //                     ticks: {
        //                         beginAtZero: true,
        //                         callback: (value) => '$' + value
        //                     }
        //                 }]
        //             }
        //         }
        //     };
        //     conf = configuration;
        //     console.log('end conf');
        // }

        // console.log('end for');
        // message.channel.send('Pinging <a:loading:690117434845298688>').then(msg => {
        //     f().then(async() => {
        //         for (let i = 0; i < 7; i++) {
        //             conf.data.datasets[0].data.shift();
        //             conf.data.datasets[0].data.push(await pong(args[0]));
        //         }
        //         console.log(conf.data.datasets[0].data);
        //         const image = await chartJSNodeCanvas.renderToBuffer(conf);
        //         // const dataUrl = await chartJSNodeCanvas.renderToDataURL(configuration);
        //         // const stream = chartJSNodeCanvas.renderToStream(configuration);
        //         msg.delete();
        //         message.channel.send(new MessageEmbed()
        //             .setDescription('Krunker Ping')
        //             .attachFiles(new MessageAttachment(Buffer.from(image, 'base64'), 'krunkerping.jpg'))
        //             .setImage('attachment://krunkerping.jpg'));
        //     });
        // });
    },
};

