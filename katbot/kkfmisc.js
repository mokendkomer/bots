const config = require("../../json/config.json");
const Discord = require("discord.js");
const ms = require("ms");
const client = new Discord.Client({
	partials: ["MESSAGE", "REACTION"],
});

client.on("message", async (message) => {
	//KAT PURGE START
	if (message.content.toLowerCase().startsWith("kat purge")) {
		const misperms = `⚠️ <@${message.author.id}> You seem to be missing the permissions to run this command.`;
		if (!message.member.hasPermission(["MANAGE_MESSAGES"])) return message.channel.send(misperms);
		const args = message.content.slice(4).split(/ +/);
		if (!args[1]) return message.channel.send(`⚠️ <@${message.author.id}> Please enter the amount of messages you want to purge.`);
		if (isNaN(args[1])) return message.channel.send(`⚠️ <@${message.author.id}> Please enter a real number.`);
		if (args[1] > 100) return message.channel.send(`⚠️ <@${message.author.id}> You cannot delete more than 100 messages.`);
		if (args[1] < 1) return message.channel.send(`⚠️ <@${message.author.id}> You must delete at least one message.`);
		await message.channel.messages.fetch({ limit: ++args[1] }).then((messages) => {
			message.channel.bulkDelete(messages);
		});
	}
	//KAT PURGE END
	//KAT BUMP START
	if (message.channel.id === "859494849429766184") {
		if (message.embeds[0] && message.embeds[0].image.url === "https://disboard.org/images/bot-command-image-bump.png") setTimeout(() => message.channel.send(`BUMP TIMME!`), 7200000);
		if (message.content.toLowerCase() !== "!d bump" && !message.author.bot) message.delete();
	}
	//KAT BUMP END
	//KAT KICK START
	if (message.content.toLowerCase().startsWith("kat kick")) {
		const misperms = `⚠️ <@${message.author.id}> You seem to be missing the permissions to run this command.`;
		const badkick = `⚠️ <@${message.author.id}> Please mention a user and try again.`;
		const noself = `⚠️ <@${message.author.id}> You cannot kick yourself.`;
		if (!message.member.hasPermission(["KICK_MEMBERS"])) return message.channel.send(misperms);
		const args = message.content.slice(4).split(/ +/);
		if (!args[1]) message.channel.send(badkick);
		const user = message.mentions.users.first();
		if (user) {
			const member = message.guild.member(user);
			if (member.id === message.author.id) return message.channel.send(noself);
			if (member) {
				member
					.kick(`User has been kicked by ${message.author.username}`)
					.then(() => {
						const suckick = `${user.tag} has been kicked.`;
						message.channel.send(suckick);
					})
					.catch((err) => {
						message.channel.send("User cannot be kicked.");
						console.log(err);
					});
			} else {
				message.reply("Cannot find user.");
			}
		}
	}
	//KAT KICK END
	//KAT BAN START
	if (message.content.toLowerCase().startsWith("kat ban")) {
		const misperms = `⚠️ <@${message.author.id}> You seem to be missing the permissions to run this command.`;
		const badban = `⚠️ <@${message.author.id}> Please mention a user and try again.`;
		const noself = `⚠️ <@${message.author.id}> You cannot ban yourself.`;
		if (!message.member.hasPermission(["BAN_MEMBERS"])) return message.channel.send(misperms);
		const args = message.content.slice(4).split(/ +/);
		if (!args[1]) message.channel.send(badban);
		const user = message.mentions.users.first();
		if (user) {
			const member = message.guild.member(user);
			if (member.id === message.author.id) return message.channel.send(noself);
			if (member) {
				member
					.kick(`User has been banned by ${message.author.username}`)
					.then(() => {
						const sucban = `${user.tag} has been banned`;
						message.channel.send(sucban);
					})
					.catch((err) => {
						message.channel.send("User cannot be banned.");
						console.log(err);
					});
			} else {
				message.reply("Cannot find user");
			}
		}
	}
	//KAT BAN END
	//KAT MUTE START
	if (message.content.toLowerCase().startsWith("kat mute")) {
		const args = message.content.slice(4).split(/ +/);
		const misperms = `⚠️ <@${message.author.id}> You cannot run this command.`;
		const target = message.mentions.users.first();
		if (!message.member.hasPermission(["MANAGE_ROLES"])) return message.channel.send(misperms);
		if (target) {
			let muteRole = message.guild.roles.cache.find((role) => role.name === "Muted");
			let memberTarget = message.guild.members.cache.get(target.id);
			if (!args[2]) {
				memberTarget.roles.add(muteRole.id);
				message.channel.send(`<@${memberTarget.user.id}> has been muted.`);
				return;
			}
			memberTarget.roles.add(muteRole.id);
			message.channel.send(`<@${memberTarget.user.id}> has been muted for ${ms(args[2])}.`);

			setTimeout(function () {
				memberTarget.roles.remove(muteRole.id);
				message.channel.send(`<@${memberTarget.user.id}> has been unmuted.`);
			}, ms(args[2]));
		} else {
			message.channel.send("Sorry, cannot find the member.");
		}
	}
	if (message.content.toLowerCase().startsWith("kat unmute")) {
		const target = message.mentions.users.first();
		const misperms = `⚠️ <@${message.author.id}> You seem to be missing the permissions to run this command.`;

		if (!message.member.hasPermission(["MANAGE_ROLES"])) return message.channel.send(misperms);

		if (target) {
			let muteRole = message.guild.roles.cache.find((role) => role.name === "Muted");

			let memberTarget = message.guild.members.cache.get(target.id);

			memberTarget.roles.remove(muteRole.id);
			message.channel.send(`<@${memberTarget.user.id}> has been unmuted.`);
		} else {
			message.channel.send("Sorry, cannot find the member.");
		}
	}
	//KAT MUTE END
});

//SUPPORT LOG START

const supportroleid = "859443785578053672";
const supportchannelid = "678774284562202664";
client.on("guildMemberUpdate", (oldMember, newMember) => {
	if (!oldMember.roles.cache.get(supportroleid) && newMember.roles.cache.get(supportroleid)) client.channels.cache.get(supportchannelid).send("<@" + newMember.id + "> is now a supporter.");
	if (oldMember.roles.cache.get(supportroleid) && !newMember.roles.cache.get(supportroleid)) client.channels.cache.get(supportchannelid).send("<@" + newMember.id + "> is not a supporter anymore.");
});

//SUPPORT LOG END

//SUPPORT CHOICE START

client.on("messageReactionAdd", async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error("Something went wrong when fetching the message:", error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	if (reaction.message.channel.id === "923448079221391370" && !reaction.me) {
		if (reaction.emoji.name === "👍") {
			const member = reaction.message.guild.members.cache.get(user.id);
			member.roles.add("859443785578053672");
			member.roles.remove("924738195906781244");
			client.channels.cache.get("678774284562202664").send(`${member.displayName} accepted the supporter rules and guidelines.`);
		}
		if (reaction.emoji.name === "👎") {
			const member = reaction.message.guild.members.cache.get(user.id);
			member.roles.remove("924738195906781244");
			member.roles.remove("859443785578053672");
			client.channels.cache.get("678774284562202664").send(`${member.displayName} rejected the supporter rules and guidelines.`);
		}
		reaction.users.remove(user.id);
	}
});

//SUPPORT CHOICE END

client.login(config.katToken);
