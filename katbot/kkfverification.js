const config = require("../../json/config.json");
const Discord = require("discord.js");
const client = new Discord.Client({
	partials: ["MESSAGE", "REACTION"],
});

const kkfVerification = "859438928879681576";
const kkfPendingVerification = "859439131275821086";
const kkfVerifiedRole = "642545338112016408";
const kkfMainChannel = "641530868267089922";
const kkfRulesChannel = "690285956518904279";
const MNVerification = "912015588451299348";
const MNPendingVerification = "912019094360961054";
const MNVerifiedRole = "912042923045031988";
const MNMainChannel = "912015221554548778";
const MNRulesChannel = "912015988537585685";

client.on("ready", () => {
	console.log("yeah i do the big workie");
});

client.on("message", (message) => {
	if (message.content === "asdf" && message.member.hasPermission("ADMINISTRATOR")) {
		message.delete();
		client.emit("guildMemberAdd", message.member);
	}
});

client.on("guildMemberAdd", (member) => {
	if (member.guild.id === "641530868267089920") {
		member.roles.add("859505310431838228");
		const modEmbed = new Discord.MessageEmbed();
		modEmbed.setTitle(`${member.displayName} has joined`);
		modEmbed.setDescription(`React with :white_check_mark: to verify them. \n <@${member.id}>`);
		modEmbed.setColor("#2cc3f5");
		modEmbed.setFooter(member.id);
		client.channels.cache
			.get(kkfPendingVerification)
			.send(modEmbed)
			.then((msg) => msg.react("✅"));

		const memberEmbed = new Discord.MessageEmbed();
		memberEmbed.setAuthor(member.displayName, member.user.avatarURL());
		memberEmbed.setTitle(`Welcome to ${member.guild.name}!`);
		memberEmbed.setDescription(`A safe space for people to communicate, give and receive support!\n
        We take our members' security very seriously. We request you to answer the following questions before you gain access to the entire server. \n
        1. How did you find out about the server?
        2. What is your reason for joining?\n
        As you wait for your entry, be sure to read <#${kkfRulesChannel}>. If you need any help, please ping an online moderator or admin to assist you.
        `);
		memberEmbed.setColor("#9CECAC");
		client.channels.cache.get(kkfVerification).send(`Hey <@${member.id}>`, memberEmbed);
	} else if (member.guild.id === "912015219721662494") {
		member.roles.add("912040516512776242");
		const modEmbed = new Discord.MessageEmbed();
		modEmbed.setTitle(`${member.displayName} has joined`);
		modEmbed.setDescription(`React with :white_check_mark: to verify them. \n <@${member.id}>`);
		modEmbed.setColor("#2cc3f5");
		modEmbed.setFooter(member.id);
		client.channels.cache
			.get(MNPendingVerification)
			.send(modEmbed)
			.then((msg) => msg.react("✅"));

		const memberEmbed = new Discord.MessageEmbed();
		memberEmbed.setAuthor(member.displayName, member.user.avatarURL());
		memberEmbed.setTitle(`Welcome to ${member.guild.name}!`);
		memberEmbed.setDescription(`A safe space for families and friends of families who are grieving the loss of a child to communicate, give and receive support!\n
        We take our members' security very seriously. We request you to answer the following questions before you gain access to the entire server.\n
        1. How did you find out about the server?
        2. What is your reason for joining?
        3. What is the child's name who has died?
        4. When did your beloved child die?\n
        As you wait for your entry, be sure to read <#${MNRulesChannel}>. If you need any help, please ping an online moderator or admin to assist you.
        `);
		memberEmbed.setColor("#9CECAC");
		client.channels.cache.get(MNVerification).send(`Hey <@${member.id}>`, memberEmbed);
	}
});

client.on("messageReactionAdd", async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log("Something went wrong when fetching the message: ", error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	if (((reaction.message.channel.id !== kkfPendingVerification || reaction.message.channel.id !== MNPendingVerification) && !reaction.message.guild.member(user).hasPermission("KICK_MEMBERS")) || reaction.me) return;
	if (reaction.message.guild.id === "912015219721662494") reaction.message.guild.member(reaction.message.embeds[0].footer.text).roles.add(MNVerifiedRole);
	if (reaction.message.guild.id === "641530868267089920") reaction.message.guild.member(reaction.message.embeds[0].footer.text).roles.add(kkfVerifiedRole);
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
	if (!oldMember.roles.cache.get(kkfVerifiedRole) && newMember.roles.cache.get(kkfVerifiedRole)) client.channels.cache.get(kkfMainChannel).send("Welcome to Kendra Kat Foundation <@" + newMember.id + ">!\nThis is the beginning of loving yourself totally & completely, right where you are\nWelcome home 💖");
	if (!oldMember.roles.cache.get(MNVerifiedRole) && newMember.roles.cache.get(MNVerifiedRole)) client.channels.cache.get(MNMainChannel).send("Welcome to Mamma's Nest <@" + newMember.id + ">!\nThis is the beginning of loving yourself totally & completely, right where you are\nWelcome home 💖");
});

client.login(config.katToken);
