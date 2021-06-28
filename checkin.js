const config = require('../config.json');
const Discord = require("discord.js");
const cron = require('node-cron');
const fs = require("fs");
const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION']
});
const emotes = ['<:greenheart:858286732314017803>', '<:blueheart:858286731908743191>', '<:purpleheart:858286732410617877>', '<:whiteheart:858286732049776681>', '<:yellowheart:858286732180455475>', '<:orangeheart:858286732382306324>', '<:blackheart:858284240566091786>', '<:brokenheart:858286731907432460>'];
let file = require('../checkin.json')
const characters = file.characters
let character = file.character

const read = () => {
	file = require('../checkin.json')
	character = file.character
}

const write = () => {
	file.character = character
	fs.writeFileSync('../checkin.json', JSON.stringify(file))
}

const pickCharacter = () => {
	character = characters[Math.floor(Math.random()*characters.length)];
	write()
	const webhookClient = new Discord.WebhookClient(config.notCheckinWebhook.id, config.notCheckinWebhook.token)
    webhookClient.send(`I will do the checkin today. Be sure to set an image I can use for checkin using the '.setimage' command`, {
		username: character.name,
		avatarURL: character.avatar,
		image: ''
	  })
}

const sendPrompt = () => {
	read()
	const embed = new Discord.MessageEmbed()
	embed.setColor('5af27d')
	embed.setTitle(`How are you feeling today? 🌈`)
	embed.setDescription(`<:greenheart:858286732314017803> - Amazing\n<:blueheart:858286731908743191> - Good\n<:purpleheart:858286732410617877> - Fine/Okay/Neutral\n<:whiteheart:858286732049776681> - I don't know how I'm feeling right now\n<:yellowheart:858286732180455475> - I think I will be fine\n<:orangeheart:858286732382306324> - I am struggling right now\n<:blackheart:858284240566091786> - I am having a really hard time and need someone to talk to\n<:brokenheart:858286731907432460> - I am at my lowest, and in a really dark place right now`)
	if(character.image)
		embed.setImage(character.image)
	const webhookClient = new Discord.WebhookClient(config.checkinWebhook.id, config.checkinWebhook.token)
	webhookClient.send({
		username: character.name,
		avatarURL: character.avatar,
		embeds: [embed]
	})

}

client.on('message', message => {
	if(message.channel.id === "852563682419540069" && message.webhookID)
		emotes.forEach(async emote => await message.react(emote))

	if(message.content.toLowerCase().startsWith('.pickcharacter'))
		pickCharacter()
	if(message.content.toLowerCase().startsWith('.sendprompt'))
		sendPrompt()
	if(message.content.toLowerCase().startsWith('.setimage')){
		if(message.attachments.first()){
			character.image = message.attachments.first().url
		} else if(message.content.length > 10)
			character.image = message.content.substring(10)
		else return message.channel.send(`I couldn't find the image you want to set.`)
		write()
		message.channel.send(`Thank you for setting today's image.`)
	}
})

client.on('messageReactionAdd', async (reaction, user) => {
	if (user.bot)
		return;
	if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
	}

	if (reaction.message.channel.id === '852563682419540069' && !emotes.includes(reaction.emoji.name))
		return reaction.remove();
})

cron.schedule(
    '30 18 * * *',
    () => {
        pickCharacter();
    }, {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    }
);

cron.schedule(
    '30 20 * * *',
    () => {
        sendPrompt();
    }, {
        scheduled: true,
        timezone: 'Asia/Kolkata'
    }
);
client.login(config.katToken)