const config = require("../../json/config.json");
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("message", async (message) => {
  if (message.channel.id === "861765154768289862") {
	if (
	  message.embeds[0] &&
	  message.embeds[0].image.url ===
		"https://disboard.org/images/bot-command-image-bump.png"
	)
	  setTimeout(
		() => message.channel.send(`GO BUMP :rage: <@&862020101544345600>`),
		7200000
	  );
	if (message.content.toLowerCase() !== "!d bump" && !message.author.bot)
	  message.delete();
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
  //HALL OF FAME
  if (
	(!reaction.me && reaction.emoji.name === "⭐" && reaction.count === 4) ||
	(reaction.emoji.name === "🏆" &&
	  reaction.message.guild.member(user).roles.cache.get("587184713387606017"))
  ) {
	const channel = "848815102664114176";
	let embed = new Discord.MessageEmbed();
	embed.setAuthor(
	  reaction.message.member.displayName,
	  reaction.message.author.avatarURL()
	);
	if (reaction.message.content)
	  embed.setDescription(
		`**${reaction.message.content}**\nclick [here](${reaction.message.url}) to jump to the message`
	  );
	else
	  embed.setDescription(
		`click [here](${reaction.message.url}) to jump to the message`
	  );
	if (reaction.message.attachments.size > 0) {
	  if (
		reaction.message.attachments.first().url.includes(".png") ||
		reaction.message.attachments.first().url.includes(".jpg") ||
		reaction.message.attachments.first().url.includes(".jpeg") ||
		reaction.message.attachments.first().url.includes(".gif")
	  )
		embed.setImage(reaction.message.attachments.first().url);
	  client.channels.cache.get(channel).send({ embed });
	} else client.channels.cache.get(channel).send({ embed });
	reaction.message.react("⭐");
  }
});

client.login(config.QuoCommToken);
