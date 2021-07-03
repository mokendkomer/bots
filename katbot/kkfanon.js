const config = require('../../json/config.json')
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

client.on("message", (message) => {
	if(message.channel.type !== "dm" || !message.content.toLowerCase().startsWith('kat'))
	  return;
	  const args = message.content.toLowerCase().split(" ")
	if(
		args[1] !== "share" &&
		args[1] !== "vent"
	) return;
	const member = client.guilds.cache.get('641530868267089920').member(message.author.id)
	if(!member || !member.roles.cache.some(role => role.id === '642545338112016408'))
		return message.channel.send(`Oh no! I don't know you.`)
	if(member.roles.cache.some(role => role.id === '859443846965755915'))
		return message.channel.send(`lol you tried x`)
	let channel = "", prompt = "", substring = 0;
		if(args[1].toLowerCase() === "share"){
		channel = "696125839053684767";
		prompt = "Thank you for sharing your story!";
		substring = 10;
		}
		if(args[1].toLowerCase() === "vent"){
		channel = "753504459837014035";
		prompt = "Your message has been sent. Take care!";
		substring = 9;
		}
		if(message.content.includes('@everyone') || message.content.includes('@here') || message.content.includes('<@'))
		    return message.channel.send(`Your message is not allowed to ping anyone.`)
		client.channels.cache.get('642537988902879242').send(`${member.displayName} sent ${message.content.substring(substring)} in <#${channel}>`);
		client.channels.cache.get(channel).send(`${message.content.substring(substring)}`);
		message.channel.send(prompt);
});

client.login(config.anonCat)
