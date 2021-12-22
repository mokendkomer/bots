const config = require("../../json/config.json");
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
let triggers = require("../../json/triggers.json");
const whitelist = [
	"917109507224649830", //moderation
	"696072776296956094", //senior moderation
	"641835049066561537", //admin lounge
	"695073113578405908", //staff voting
	"917089077600329808", //staff voting
];
client.on("message", (message) => {
	if ((message.author.bot && message.author.id !== 860957953556480013) || !message.member) return;

	if (message.content.toLowerCase().startsWith("addtw ")) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:warning: You don't have permission to add trigger words. Please DM a moderator or admin if you want to add one.`);
		const word = message.content.substring(6);
		const index = triggers.indexOf(word);
		if (index !== -1) return message.channel.send(`:warning: ||${word}|| is already a trigger word.`);
		triggers.push(word.toLowerCase());
		fs.writeFileSync("../../json/triggers.json", JSON.stringify(triggers));
		message.channel.send(`Thank you for adding ||${word}|| as a trigger word`);
		triggers = require("../../json/triggers.json");
		return;
	}
	if (message.content.toLowerCase().startsWith("removetw ")) {
		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`:warning: You don't have permission to remove trigger words. Please DM a moderator or admin if you want to remove one.`);
		const word = message.content.substring(9);
		const index = triggers.indexOf(word);
		if (index === -1) return message.channel.send(`:warning: ||${word}|| doesn't exist in the list of trigger words.`);
		triggers.splice(index, 1);
		fs.writeFileSync("../../json/triggers.json", JSON.stringify(triggers));
		message.channel.send(`Thank you for removing ||${word}|| from the trigger words.`);
		triggers = require("../../json/triggers.json");
		return;
	}
	if (message.content.toLowerCase().startsWith("showtw")) {
		if (message.channel.id !== "668329314391162911" && message.channel.id !== "664023523899211776") return message.channel.send(`:warning: This command cannot be run outside <#668329314391162911> and <#664023523899211776>`);
		message.channel.send(`The trigger words are:\n||${triggers.join(", ")}||`);
		return;
	}
	if (message.content.toLowerCase().startsWith("twhelp") || message.content.toLowerCase().startsWith("tw help") || (message.mentions.members.some((element) => element.id === client.user.id) && message.content.toLowerCase().includes("trigger words"))) {
		const embed = new Discord.MessageEmbed();
		embed.setTitle(`Trigger word commands`);
		embed.addField(`showtw`, `Shows all trigger words`);
		embed.addField(`addtw [trigger word]`, `Adds a trigger word (mod/admin only)`);
		embed.addField(`removetw [trigger word]`, `Removes a trigger word (mod/admin only)`);
		embed.setColor(`#dc94eb`);
		message.channel.send({ embed });
		return;
	}

	if (triggers.some((element) => message.content.toLowerCase().includes(" " + element + " ")) || triggers.some((element) => message.content.toLowerCase().startsWith(element + " ")) || triggers.some((element) => message.content.toLowerCase().endsWith(" " + element)) || triggers.some((element) => message.content.toLowerCase() === element)) {
		if (whitelist.includes(message.channel.id)) return;
		let content = message.content.split("||").join("");
		message.channel
			.createWebhook(message.member.displayName, {
				avatar: message.author.avatarURL(),
			})
			.then((webhook) => {
				webhook.send(`||${content}||`).then(() => webhook.delete());
			});
		message.delete();
	}
});

client.login(config.katToken);
