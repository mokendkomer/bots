const config = require('../../json/config.json')
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

client.on("message", (message) => {
	if(message.channel.type !== "dm")
	  return;
	  const args = message.content.toLowerCase().split(" ")
	if(
		args[0] !== "q.ask" &&
		args[0] !== "q.vent" &&
		args[0] !== "q.vent1" &&
		args[0] !== "q.vent2"
		// args[0] !== "q.report"
	) return;
	const member = client.guilds.cache.get('587139618999369739').member(message.author.id)
	if(!member || !member.roles.cache.some(role => role.id === '587187354851082250'))
		return message.channel.send(`do i even know you lol`)
	if(member.roles.cache.some(role => role.id === '751530631489650738'))
		return message.channel.send(`lol you tried x`)
	let channel = "", prompt = "", substring = 0;
		if(args[0].toLowerCase() === "q.ask"){
		channel = "639902815849938975";
		prompt = "Thank you for your question!";
		substring = args[0].length + 1;
		}
		if(args[0].toLowerCase() === "q.vent" || args[0].toLowerCase() === "q.vent1"){
		channel = "739150769722228806";
		prompt = "Your message has been sent. Take care!";
		substring = args[0].length + 1;
		}
		if(args[0].toLowerCase() === "q.vent2"){
		channel = "793407631066005554";
		prompt = "Your message has been sent. Take care!";
		substring = args[0].length + 1;
		}
		if(message.content.includes('@everyone') || message.content.includes('@here') || message.content.includes('<@'))
		return message.channel.send(`Your message is not allowed to ping anyone.`)
		client.channels.cache.get('587219379456966701').send(`${member.displayName} sent ${message.content.substring(substring)} in <#${channel}>`);
		client.channels.cache.get(channel).send(`${message.content.substring(substring)}`);
		message.channel.send(prompt);
});

client.login(config.QuoCommToken)
