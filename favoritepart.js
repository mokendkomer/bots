const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const cron = require('node-cron');

const mokendDm = '845575192688459786';
const srijaDm = '845575380970504224';
const favchannel = '856942237450240051';

const emoji = '<:angycat:856502599225835570>';

let mokendfav = `Probably that time when he ignored my DMs when I asked what his favorite part was ${emoji}`;
let srijafav = `Probably that time when he ignored my DMs when I asked what his favorite part was ${emoji}`;


cron.schedule(
    '30 23 * * *',
    () => {
        dmpeople();
    },
    {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    }
);

cron.schedule(
    '0 3 * * *',
    () => {
        sendfav();
    },
    {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    }
);

client.on('ready', () => {
    console.log(`ye i work ez`);
});

client.on('message', async (message) => {
    if (message.channel.type === 'dm' && !message.author.bot) {
        if (message.author.id === mokendDm) {
            mokendfav = message.content;
        } else if (message.author.id === srijaDm) {
            srijafav = message.content;
        }
    }
    if (message.content === 'send cute' && !message.author.bot) {
        sendfav();
        message.delete();
    }
});

function dmpeople() {
    client.users.cache.get(mokendDm).send('Oioi Mokend Mokend! What was your favorite part of todayy? 💙');
    client.users.cache.get(srijaDm).send('Ello Srija! What was your favorite part of todayy? 💙');
}

function sendfav() {
    let embed = new Discord.MessageEmbed()
        .setColor('#0a9ba6')
        .setTitle('Favorite Parts of the Day! 💙')
        .setDescription('These were the cutest parts of the day for you')
        .addFields(
            {
                name: "Mokend's favorite parts: ",
                value: mokendfav
            },
            {
                name: "Srija's favorite parts: ",
                value: srijafav
            }
        );

    client.channels.cache.get(favchannel).send(embed);
}

client.login(config.teslaToken);
