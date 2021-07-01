const config = require('../../json/config.json')
const Discord = require('discord.js');
const client = new Discord.Client();
const cron = require('node-cron');
const fs = require('fs');

const mokendDm = '845575192688459786';
const srijaDm = '845575380970504224';
const favchannel = '856942237450240051';

const emoji = '<:angycat:856502599225835570>';
const mokendbear = '<:mokendlove:793852414905155634>';
const srijabear = '<:srijalove:793852415228903474>';

let mokendfav = `Probably that time when he ignored my DMs when I asked what his favorite part was ${emoji}`;
let srijafav = `Probably that time when she ignored my DMs when I asked what her favorite part was ${emoji}`;

cron.schedule(
	'30 23 * * *',
	() => {
		dmpeople();
		mokendfav = `Probably that time when he ignored my DMs when I asked what his favorite part was ${emoji}`;
		srijafav = `Probably that time when she ignored my DMs when I asked what her favorite part was ${emoji}`;
	}, {
		scheduled: true,
		timezone: 'Asia/Kolkata'
	}
);

cron.schedule(
	'0 3 * * *',
	() => {
		sendfav();
	}, {
		scheduled: true,
		timezone: 'Asia/Kolkata'
	}
);

client.on('ready', () => {
	console.log(`ye i work ez`);
	client.user.setActivity('being big cute', {
		type: 'PLAYING'
	});
});

process.on('unhandledRejection', (error) => {
	bigerror(
		`name: ${error.name}\nmessage: ${error.message}\npath: ${error.path}\ncode: ${error.code}\nmethod: ${error.method}`
	);
});

client.on('message', async (message) => {
	if (message.channel.type === 'dm' && !message.author.bot) {
		if (message.author.id === mokendDm) {
			mokendfav = message.content;
			if (message.content.length > 2048) {
				message.channel.send(
					`Oh no! This is tooo big s m h. Twiii sending something that I can wemembewww hmpff ${emoji}`
				);
				mokendfav = `He sent something that's too big for me to wemembewwww ${emoji}`;
				return;
			} else {
				message.channel.send(`Yayaayay! I can send this thing when it's the right time hehehe!`);
			}
		} else if (message.author.id === srijaDm) {
			srijafav = message.content;
			if (message.content.length > 2048) {
				message.channel.send(
					`Oh no! This is tooo big s m h. Twiii sending something that I can wemembewww hmpff ${emoji}`
				);
				srijafav = `She sent something that's too big for me to wemembewwww ${emoji}`;
				return;
			} else {
				message.channel.send(`Yayaayay! I can send this thing when it's the right time hehehe!`);
			}
		}
	}
	if (message.content.toLowerCase() === 'send cute' && !message.author.bot) {
		sendfav();
		message.delete();
	}
});

function dmpeople() {
	client.users.cache.get(mokendDm).send('Oioi Mokend Mokend! What was your favorite part of todayy? 💙');
	client.users.cache.get(srijaDm).send('Ello Srija! What was your favorite part of todayy?');
}

function sendfav() {
	let mokendEmbed = new Discord.MessageEmbed()
		.setColor('#0a9ba6')
		.setAuthor('Mokendbear', client.users.cache.get(mokendDm).avatarURL())
		.setTitle(`Mukund's favorite parts of the yesterday! ${mokendbear}`)
		.setDescription(mokendfav);

	let srijaEmbed = new Discord.MessageEmbed()
		.setColor('#0a9ba6')
		.setAuthor('Srijabear', client.users.cache.get(srijaDm).avatarURL())
		.setTitle(`Srija's favorite parts of yesterday!  ${srijabear}`)
		.setDescription(srijafav);

	client.channels.cache.get(favchannel).send(mokendEmbed);
	client.channels.cache.get(favchannel).send(srijaEmbed);
}

const bigerror = (error) => {
	fs.writeFileSync('./errorthing.txt', error);
	client.users.cache.get(mokendDm).send('Ohnoo! Something poopy happened!');
	client.users.cache.get(mokendDm).send('Poopy error file', {
		files: ['./errorthing.txt']
	});
	client.users.cache.get(srijaDm).send('Ohnoo! Something poopy happened!');
	client.users.cache.get(srijaDm).send('Poopy error file', {
		files: ['./errorthing.txt']
	});
};

client.login(config.teslaToken);