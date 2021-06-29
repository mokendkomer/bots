const config = require('../config.json');
const Discord = require("discord.js");
const cron = require('node-cron');
const fs = require("fs");
const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION']
});
const checkin = '647526576707338251'
const emotes = ['<:greenheart:859495100497264670>','<:blueheart:859496195331850290>','<:purpleheart:859496196028760064>','<:whiteheart:859496196350672944>','<:yellowheart:859495100543401994>','<:orangeheart:859496195885498408>','<:blackheart:859495100492808232>','<:brokenheart:859496195683909652>']
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
	embed.setDescription(`<:greenheart:859495100497264670> - Amazing\n<:blueheart:859496195331850290> - Good\n<:purpleheart:859496196028760064> - Fine/Okay/Neutral\n<:whiteheart:859496196350672944> - I don't know how I'm feeling right now\n<:yellowheart:859495100543401994> - I think I will be fine\n<:orangeheart:859496195885498408> - I am struggling right now\n<:blackheart:859495100492808232> - I am having a really hard time and need someone to talk to\n<:brokenheart:859496195683909652> - I am at my lowest, and in a really dark place right now`)
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
	if(message.channel.id === checkin && message.webhookID)
		emotes.forEach(async emote => await message.react(emote))

	if(message.content.toLowerCase().startsWith('.pickcharacter') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		pickCharacter()
	}
	if(message.content.toLowerCase().startsWith('.sendprompt') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		sendPrompt()
	}
	if(message.content.toLowerCase().startsWith('.setimage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		if(message.attachments.first()){
			character.image = message.attachments.first().url
		} else if(message.content.length > 10)
			character.image = message.content.substring(10)
		else return message.channel.send(`I couldn't find the image you want to set.`)
		client.users.cache.get('383273509884919810').send(`Today's image was set by <@${message.author.id}>\n${character.image}`)
		write()
		message.channel.send(`Thank you for setting today's image.`)
	}
	if(message.content.toLowerCase().startsWith('.getimage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		if(character.image)
			return message.channel.send(`Today's image is\n${character.image}`)
		else
			return message.channel.send(`Today's image has not been set yet`)
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

	if (reaction.message.channel.id === checkin && !emotes.includes(reaction.emoji.name))
		return reaction.remove();
})


cron.schedule(
	'30 18 * * *',
	() => {
		pickCharacter()	  
	}, {
	scheduled: true,
	timezone: 'Asia/Kolkata'
	}
);
cron.schedule(
	'30 20 * * *',
	() => {
		sendPrompt()
		character.image = "";
		write();
	}, {
	scheduled: true,
	timezone: 'Asia/Kolkata'
	}
);


client.login(config.katToken)