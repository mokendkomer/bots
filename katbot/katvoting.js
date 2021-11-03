const config = require("../../json/config.json");
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ["MESSAGE", "REACTION"] });
const fs = require("fs");

client.on("messageReactionAdd", (reaction, user) => {
	const message = reaction.message;
	let contest = "";
	if (message.channel.id === "905321199331053568") {
		contest = "costume";
	} else if (message.channel.id === "905321728220221460") {
		contest = "pumpkin";
	} else return;

	let voters = require("../../json/voters.json");

	if (contest === "costume") {
		if (voters.constumevoters.includes(user.id)) {
			reaction.users.remove(user.id);
			return user.send(`You've already voted for the halloween costume competition <:milkboo:904028990073888768>`);
		} else {
			voters.constumevoters.push(user.id);
			voters.costumes.find((ez) => ez.messageID === message.id).votes.push(user.id);
			fs.writeFileSync("../../json/voters.json", JSON.stringify(voters));
			user.send(`You have successfully voted for the halloween costume contest! Hope you have a great day <:milkboo:904028990073888768>`);
		}
	} else if (contest === "pumpkin") {
		if (voters.pumpkinvoters.includes(user.id)) {
			reaction.users.remove(user.id);
			return user.send(`You've already voted for the pumpkin carving competition 🎃`);
		} else {
			voters.pumpkinvoters.push(user.id);
			voters.pumpkins.find((ez) => ez.messageID === message.id).votes.push(user.id);
			fs.writeFileSync("../../json/voters.json", JSON.stringify(voters));
			user.send(`You have successfully voted for the pumpkin carving contest! Hope you have a great day 🎃`);
		}
	}
	reaction.users.remove(user.id);
});

client.login(config.katToken);
