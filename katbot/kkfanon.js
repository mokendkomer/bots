const config = require("../../json/config.json");
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ["MESSAGE", "REACTION"] });

client.on("message", (message) => {
	if (message.channel.type !== "dm" || !message.content.toLowerCase().startsWith("kat")) return;
	const args = message.content.toLowerCase().split(" ");
	if (args[1] !== "share" && args[1] !== "vent" && args[1] !== "ventnr" && args[1 !== "supportervent"] && args[1] !== "support" && args[1] !== "support1" && args[1] !== "support2" && args[1] !== "support3") return;
	const member = client.guilds.cache.get("641530868267089920").member(message.author.id);
	if (!member || !member.roles.cache.some((role) => role.id === "642545338112016408")) return message.channel.send(`Oh no! I don't know you.`);
	if (member.roles.cache.some((role) => role.id === "859443846965755915")) return message.channel.send(`Sorry, you're muted.`);

	let channel = "",
		prompt = "",
		substring = 0;
	if (args[1].toLowerCase() === "share") {
		channel = "696125839053684767";
		prompt = "Thank you for sharing your story!";
		substring = 10;
	}
	if (args[1].toLowerCase() === "vent") {
		channel = "928310005147508856";
		prompt = "Your message has been sent. I hope you feel better soon. Take care!";
		substring = 9;
	}
	if (args[1].toLowerCase() === "ventnr") {
		channel = "753504459837014035";
		prompt = "Your message has been sent. I hope you feel better soon. Take care!";
		substring = 11;
	}
	if (args[1].toLowerCase() === "supportervent") {
		if (!client.guilds.cache.get("641530868267089920").member(message.author.id).roles.cache.get("859443785578053672")) return message.author.send(`Sorry, you're not a supporter.`);
		channel = "972738890098163792";
		prompt = "Your message has been sent. I hope you feel better soon. Take care!";
		substring = 18;
	}
	if (args[1].toLowerCase() === "support") {
		channel = "642037072890429451";
		prompt = "Your message has been sent. I hope you feel better soon. Take care!";
		substring = 12;
	}
	if (args[1].toLowerCase() === "support1") {
		channel = "642037072890429451";
		prompt = "Your message has been sent. I hope you feel better soon. Take care!";
		substring = 13;
	}
	if (args[1].toLowerCase() === "support2") {
		channel = "674618839060971550";
		prompt = "Your message has been sent. I hope you feel better soon. Take care!";
		substring = 13;
	}
	if (args[1].toLowerCase() === "support3") {
		channel = "698099638850289685";
		prompt = "Your message has been sent. I hope you feel better soon. Take care!";
		substring = 13;
	}
	if (message.content.includes("@everyone") || message.content.includes("@here") || message.content.includes("<@")) return message.channel.send(`Your message is not allowed to ping anyone.`);
	client.channels.cache.get("642537988902879242").send(`|| ${member.displayName} || sent ${message.content.substring(substring)} in <#${channel}>`);
	client.channels.cache.get(channel).send(`${message.content.substring(substring)}`);
	message.channel.send(prompt);
});

client.login(config.anonCat);
