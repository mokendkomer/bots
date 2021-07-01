const config = require('../../json/config.json')
const Discord = require("discord.js");
const cron = require('node-cron');
const fs = require("fs");
const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION']
});
const checkin = '845817544484323349'
const emotes = ['❤️','🧡','💛','🤍','💚','💙','💜','💔']
let file = require('../../json/checkin.json')
const characters = file.characters
let character = file.character
const read = () => {
	file = require('.../../json/checkin.json')
	character = file.character
}
const write = () => {
	file.character = character
	fs.writeFileSync('.../../json/checkin.json', JSON.stringify(file))
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
	embed.setDescription(`❤️ - Amazing\n🧡 - Good\n💛 - Fine/Okay/Neutral\n🤍 - I don't know how I'm feeling right now\n💚 - I think I will be fine\n💙 - I'm struggling right now\n💜 - I'm having a really hard time and need somebody to talk to\n💔 - I'm at my lowest, and in a really dark place right now.\n\n${character.message}`)
	
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
	if(message.content.length > commandLength)
		character.message = message.content.substring(commandLength)
	else return message.channel.send(`I couldn't find the message you want to set.`)
	write()
	message.channel.send(`Thank you for setting today's message.`)
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
		if(character.image.length)
			return message.channel.send(`Today's image has already been set to the following image. If you'd like to overwrite this, try running \`.overwriteimage\`.\n${character.image}`)
		setImage(message, 10)
	}
	if(message.content.toLowerCase().startsWith('.overwriteimage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		setImage(message, 16)
	}
	if(message.content.toLowerCase().startsWith('.getimage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		if(character.image.length)
			return message.channel.send(`Today's image is\n${character.image}`)
		else
			return message.channel.send(`Today's image has not been set yet`)
	}
	if(message.content.toLowerCase().startsWith('.setmessage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		if(character.message.length)
			return message.channel.send(`Today's message has already been set to the following. If you'd like to overwrite this, try running \`.overwritemessage\`.\n${character.message}`)
		setMessage(message, 12)
	}
	if(message.content.toLowerCase().startsWith('.overwritemessage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
		setMessage(message, 18)
	}
	if(message.content.toLowerCase().startsWith('.getmessage') && message.member && message.member.hasPermission('MANAGE_MESSAGES')){
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