const config = require('../../json/config.json')
const Discord = require("discord.js");
const fs = require('fs');
const cron = require('node-cron')
const client = new Discord.Client();
const mokendDm = '845575192688459786';
const srijaDm = '845575380970504224';
let reminders = [];
let embed = {}
const write = () => fs.writeFileSync('../../json/reminders.json', JSON.stringify(reminders));
const read = () => reminders = JSON.parse(fs.readFileSync('../../json/reminders.json'));
const makeEmbed = () => {
	embed = new Discord.MessageEmbed()
	embed.setColor('f2a0eb')
}
let text = ``
const wittleTolk = (thing) => {
	text = thing
	text = text.split("r").join("w");
	text = text.split("l").join("w");
	text = text.split("my").join("moi");
}
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const takeReminder = (activity, user) => {
	read()
	const id = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
	reminders.push({
		id,
		user: user,
		activity: activity
	});
	write()
	return id;
}

const markDone = (id) => {
	read()
	let task = reminders.find(reminder => reminder.id === id);
	if (!task)
		return `o nno! I can't find ${id}`
	reminders = reminders.filter(item => item.id !== id);
	write()
	return 'yayayyyyayayy I gwad to heow that you aw dono wif ' + task.activity + " heow is a cookie 🍪"
}
const remind = (array) => {
	array.forEach(reminder => {
		makeEmbed()
		embed.setTitle(`🍪 wemindoww 🍪`)
		embed.setDescription(`I hope you wemembow to do this\nif you don't, that is okay, I'm heow to wemind you nowie\ncan you pwease do this:\n> **${reminder.activity}**`)
		embed.setFooter(reminder.id)
		client.users.cache.get(reminder.user).send(embed)
	})

}

client.on('message', message => {
	if (message.content.toLowerCase().startsWith('remind me to ')) {
		if (message.content.length < 13)
			return message.channel.send('o nno! you need to mention what you want to be weminded about\ncan you twi againn')
		wittleTolk(message.content.substring(13))
		const id = takeReminder(text, message.author.id)
		makeEmbed()
		embed.setTitle(`new wemindoww`)
		embed.setDescription(`I will wemind you to ${text}`)
		embed.setFooter(id)
		message.channel.send(embed)
	} else if (message.content.toLowerCase().startsWith('remind him to ')) {
		if (message.content.length < 14)
			return message.channel.send('o nno! you need to mention what you want him to be weminded about\ncan you twi againn')
		wittleTolk(message.content.substring(14))
		takeReminder(text, mokendDm)
		message.channel.send(`okkii I remind him to ${text} evowy 2 howows`)
	} else if (message.content.toLowerCase().startsWith("i'm done with ")) {
		message.channel.send(markDone(message.content.substring(14)))
	} else if (message.content.toLowerCase().startsWith("im done with ")) {
		message.channel.send(markDone(message.content.substring(13)))
		} else if (message.content.toLowerCase().startsWith('what are my reminders')){
			read()
			const partialReminders = reminders.filter(reminder => reminder.user === message.author.id)
			remind(partialReminders)
			

	}
})

client.on('ready', () => {
	// client.users.cache.get(srijaDm).send('HEWWOO I hope you aw happy I wuvv youuu')
	console.log('I am weady to twi mi bestt big pwomise');
})

cron.schedule('0 9-23/2 * * *', () => {
	read()
	remind()
})

cron.schedule(
	'0 9 * * *',
	() => {
		client.user.setActivity('with wittol mokendd ', { type: 'PLAYING' });
	}, {
	scheduled: true,
	timezone: 'Asia/Kolkata'
}
);

cron.schedule(
	'0 21 * * *',
	() => {
		client.user.setActivity('in moi dweams ', { type: 'PLAYING' });
	}, {
	scheduled: true,
	timezone: 'Asia/Kolkata'
}
);


client.login(config.littleSrijaToken);
