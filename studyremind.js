const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const cron = require('node-cron');

const srijaDm = '845575380970504224';
const angymokned = '<:mokendangy:793852416213647371>';

client.on('ready', () => {
    console.log(`yessooo I do the big workie khekhekhe`);
    client.user.setActivity('with wittol swijaa ', {type: 'PLAYING'});
});

cron.schedule(
    '0 9-23 * * *',
    () => {
        client.users.cache.get(srijaDm).send(`Ewwo Swwija! Okkiiii I hope you awwe studying nowie! If you awwe not, it'd be big cute if you start studying nowie s m h what are you waiting for ${angymokned}`);
    }, {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    }
);

cron.schedule(
    '0 0 * * *',
    () => {
        client.users.cache.get(srijaDm).send(`Ello Srija! Okkiiii I hope you are studying nowie! If you are not, it'd be big cute if you start studying nowie s m h what are you waiting for ${angymokned} Alsoooo go sleep soono`);
    }, {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    }
);

client.login(config.littleMokendToken);