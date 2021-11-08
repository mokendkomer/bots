const config = require("../../json/config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const yes = ["Do it", "sure", "fine", "okay", "ehh sure", "go for it", "it's probably a bad decision, but sure", "ehh, live a little", "only if you promise to never do it again", "HELL YEAH"];
const no = ["NO!", "Please don't", "Nah I don't think you need to do it", "Why though s m h", "not againnnn", "Don't you dare", "You don't need to do it", "Stop spending so much time on things you don't need to do", "N.O.", "nono"];

client.on("message", (message) => {
	if (message.channel.id === "907297604096905276" && !message.author.bot) {
		const random = Math.random();
		if (random < 0.2) return message.channel.send(yes[Math.floor(Math.random() * yes.length)]);
		else return message.channel.send(no[Math.floor(Math.random() * no.length)]);
	}
});

client.login(config.mnmToken);
