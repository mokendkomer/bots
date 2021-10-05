const config = require("../../json/config.json");
const cleverbot = require("cleverbot-free");
const Discord = require("discord.js");
const client = new Discord.Client();
let context = ["hey", "How are you?", "foine", "Fine!"];
const yes = ["Sure babe, get it", "UGHHH Finee babe, you can have", "Only if you take me out for dinner tonight", "Do I get one too?", "Only if you really want it babe"];
const no = ["NO!", "Please don't", "Nah I don't think you need it", "Why though s m h", "Babe not againnnn", "Don't you dare", "Don't you have it already?", "Why don't you take me out to dinner instead?", "You don't need it babe", "Stop spending so much on things you don't need", "N.O.", "nono"];

client.on("message", (message) => {
	if ((message.channel.id === "845575192688459786" || message.channel.id === "894230139746000919") && !message.author.bot) {
		message.channel.startTyping();
		cleverbot(message.content, context).then((res) => {
			message.channel.send(res);
			if (context.length > 100) {
				context.shift();
				context.shift();
			}
			context.push(message.content);
			context.push(res);
		});
		message.channel.stopTyping();
	} else if (message.channel.id === "894236046550765579" && !message.author.bot) {
		const random = Math.random();
		if (random < 0.1) return message.channel.send(yes[Math.floor(Math.random() * yes.length)]);
		else return message.channel.send(no[Math.floor(Math.random() * no.length)]);
	}
});

client.login(config.daniToken);
