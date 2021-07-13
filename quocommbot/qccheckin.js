const config = require('../../json/config.json')
const Discord = require("discord.js");
const cron = require('node-cron');
const fs = require("fs");
const client = new Discord.Client({
	partials: ['MESSAGE', 'REACTION']
});
const checkin = '845817544484323349'
const emotes = ['❤️','🧡','💛','🤍','💚','💙','💜','💔']
let file = require('../../json/qccheckin.json')
const characters = file.characters
let character = file.character
const read = () => {
	file = require('../../json/qccheckin.json')
	character = file.character
}
const write = () => {
	file.character = character
	fs.writeFileSync('../../json/qccheckin.json', JSON.stringify(file))
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
	let message = `${character.message.length ? character.message + `\n\nSo, how are you feeling today?` : '**Hello! How are you feeling today?**'}\n❤️ - Amazing\n🧡 - Good\n💛 - Fine/Okay/Neutral\n🤍 - I don't know how I'm feeling right now\n💚 - I think I will be fine\n💙 - I'm struggling right now\n💜 - I'm having a really hard time and need somebody to talk to\n💔 - I'm at my lowest, and in a really dark place right now.`
	const webhookClient = new Discord.WebhookClient(config.qcheckinWebhook.id, config.qcheckinWebhook.token)
	// const webhookClient = new Discord.WebhookClient(config.qnotCheckinWebhook.id, config.qnotCheckinWebhook.token)
	if(character.image)
		webhookClient.send(message, {
			username: character.name,
			avatarURL: character.avatar,
			files:[
				character.image
			]
		})
	else 	webhookClient.send(message, {
		username: character.name,
		avatarURL: character.avatar,
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
	if(message.channel.id === checkin){
		if(!message.webhookID){
			character.done = true
			write()
		}
		emotes.forEach(async emote => await message.react(emote))
	}
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
	if(message.content.toLowerCase() === "q.checkin" && !message.author.bot)
    {
        const embed = new Discord.MessageEmbed();
        embed.setTitle(`Check-in commands`);
        embed.setColor('#099c92');
        embed.addField("q.setimage [attachment/link]","Attach an image or the link of an image to send with the embed");
        embed.addField("q.setmessage [your message]","Add a cute message you'd like to send along with the embed (must be below 2000 characters)");
        embed.addField("q.getimage","Check which image is set to be sent with the embed");
        embed.addField("q.getmessage","Check which message is set to be sent along with the embed");
        embed.addField("How does it work?","At a pre-set time (11:30 a.m. GMT), a randomly picked character will send a reminder in <#860137682759188490> reminding you to set an image and message (both optional but cute if there) for the check-in.\nYou can use the above mentioned functions to do the same. At 1:30 p.m. GMT, the character will send a text to the <#845817544484323349> channel asking people how they are feeling along with the image and message you might have set. :) ")
        message.channel.send(embed);
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
		if(!character.done)
			pickCharacter()	  
	}, {
	scheduled: true,
	timezone: 'Asia/Kolkata'
	}
);
cron.schedule(
	'0 19 * * *',
	() => {
		if(!character.done)
			sendPrompt();
		character.image = "";
		character.message = "";
		character.done = false;
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