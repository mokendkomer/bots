const config = require('../../json/config.json')
const Discord = require("discord.js");
const cron = require('node-cron');
const fs = require("fs");
const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION']
});
const checkin = '845817544484323349'
const emotes = ['❤️','🧡','💛','🤍','💚','💙','💜','💔']
let file = require('../../json/kkfcheckin.json')
const characters = file.characters
let character = file.character
const read = () => {
	file = require('../../json/kkfcheckin.json')
	character = file.character
}
const write = () => {
	file.character = character
	fs.writeFileSync('../../json/kkfcheckin.json', JSON.stringify(file))
}
const pickCharacter = () => {
	character = characters[Math.floor(Math.random()*characters.length)];
	character.image = ""
	character.message = ""
	write()
	const webhookClient = new Discord.WebhookClient(config.qnotCheckinWebhook.id, config.qnotCheckinWebhook.token)
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
	embed.setTitle(`How are you feeling today?`)
	if(character.message.length)
		embed.setDescription(character.message)
	embed.addField(`React with how you're feeling!`,`❤️ - Amazing\n🧡 - Good\n💛 - Fine/Okay/Neutral\n🤍 - I don't know how I'm feeling right now\n💚 - I think I will be fine\n💙 - I'm struggling right now\n💜 - I'm having a really hard time and need somebody to talk to\n💔 - I'm at my lowest, and in a really dark place right now.`)
	if(character.image)
		embed.setImage(character.image)
	const webhookClient = new Discord.WebhookClient(config.qcheckinWebhook.id, config.qcheckinWebhook.token)
	webhookClient.send({
		username: character.name,
		avatarURL: character.avatar,
		embeds: [embed]
	})
}

const setImage = (message, commandLength) => {
	if(message.attachments.first()){
		character.image = message.attachments.first().url
	} else if(message.content.length > commandLength)
		character.image = message.content.substring(commandLength)
	else return message.channel.send(`I couldn't find the image you want to set.`)
	write()
	message.channel.send(`Thank you for setting today's image.`)
}
const setMessage = (message, commandLength) => {
	if(message.content.length > (2048 + commandLength))
		return message.channel.send(`Your message is too long by ${2048 + commandLength - message.content.length} characters.`)
	if(message.content.length > commandLength)
		character.message = message.content.substring(commandLength)
	else return message.channel.send(`I couldn't find the message you want to set.`)
	write()
	message.channel.send(`Thank you for setting today's message.`)
}

client.on('message', message => {
	if(message.channel.id === checkin && message.webhookID)
		emotes.forEach(async emote => await message.react(emote))
	if(message.content.toLowerCase().startsWith('q.pickcharacter') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		pickCharacter()
	}
	if(message.content.toLowerCase().startsWith('q.sendprompt') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		sendPrompt()
	}
	if(message.content.toLowerCase().startsWith('q.setimage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		if(character.image.length)
			return message.channel.send(`Today's image has already been set to the following image. If you'd like to overwrite this, try running \`.overwriteimage\`.\n${character.image}`)
		setImage(message, 11)
	}
	if(message.content.toLowerCase().startsWith('q.overwriteimage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		setImage(message, 17)
	}
	if(message.content.toLowerCase().startsWith('q.getimage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		if(character.image.length)
			return message.channel.send(`Today's image is\n${character.image}`)
		else
			return message.channel.send(`Today's image has not been set yet`)
	}
	if(message.content.toLowerCase().startsWith('q.setmessage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		if(character.message.length)
			return message.channel.send(`Today's message has already been set to the following. If you'd like to overwrite this, try running \`.overwritemessage\`.\n${character.message}`)
		setMessage(message, 13)
	}
	if(message.content.toLowerCase().startsWith('q.overwritemessage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		setMessage(message, 19)
	}
	if(message.content.toLowerCase().startsWith('q.getmessage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		if(character.message.length)
			return message.channel.send(`Today's message is\n${character.message}`)
		else
			return message.channel.send(`Today's message has not been set yet`)
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
	'0 17 * * *',
	() => {
		pickCharacter()	  
	}, {
	scheduled: true,
	timezone: 'Asia/Kolkata'
	}
);
cron.schedule(
	'0 19 * * *',
	() => {
		sendPrompt()
		character.image = "";
		character.message = "";
		write();
	}, {
	scheduled: true,
	timezone: 'Asia/Kolkata'
	}
);

process.on('unhandledRejection', (error) => {
	console.log(`name: ${error.name}\nmessage: ${error.message}\npath: ${error.path}\ncode: ${error.code}\nmethod: ${error.method}`);
});



client.login(config.QuoCommToken)