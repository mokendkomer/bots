const config = require("../../json/config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios").default;
const sendMessage = (message, response) => {
	const embed = new Discord.MessageEmbed();
	embed.setColor("0x" + message.member.roles.highest.hexColor);
	if (response.data.country) {
		embed.setTitle("COVID-19 Stats for " + response.data.country);
		embed.setThumbnail(response.data.countryInfo.flag);
	} else {
		embed.setTitle("WorldWide COVID-19 Stats");
		embed.setThumbnail("https://icons.iconarchive.com/icons/dtafalonso/modern-xp/512/ModernXP-73-Globe-icon.png");
	}
	console.log(response.data);
	embed.setAuthor(message.member.nickname, message.author.avatarURL());
	embed.addField("Cases Today", response.data.todayCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
	embed.addField("Active", response.data.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
	embed.addField("Deaths Today", response.data.todayDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
	embed.addField("Recovered Today", response.data.todayRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
	embed.addField("1 Case Per People", Math.round(response.data.population / response.data.cases), true);
	embed.addField("1 Test Per People", Math.round(response.data.population / response.data.tests), true);
	embed.addField("Total Cases", response.data.cases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
	embed.addField("Total Recovered", response.data.recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
	embed.addField("Total Deaths", response.data.deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), true);
	embed.setFooter(`Tests: ${response.data.tests.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`, message.guild.iconURL());
	message.channel.send({
		embed,
	});
};
// /covidstats

client.on("message", async (message) => {
	// bump
	if (message.channel.id === "861765154768289862") {
		if (message.embeds[0] && message.embeds[0].image.url === "https://disboard.org/images/bot-command-image-bump.png") setTimeout(() => message.channel.send(`GO BUMP :rage: <@&862020101544345600>`), 7200000);
		if (message.content.toLowerCase() !== "!d bump" && !message.author.bot) message.delete();
	}
	// /bump
	// covidstats
	if ((message.channel.id === "849193476372430860" || message.channel.id === "587152950078734348") && message.content.toLowerCase().startsWith("q.corona")) {
		let country = message.content.toLowerCase().substr(9);
		if (!country.length) country = "all";
		else country = `countries/${country}`;
		axios
			.get("https://disease.sh/v3/covid-19/" + country)
			.then((response) => sendMessage(message, response))
			.catch((error) => {
				console.log(error);
				message.channel.send("Something went wrong");
			});
	}
	// /covidstats
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
	if ((!reaction.me && reaction.emoji.name === "⭐" && reaction.count === 6) || (reaction.emoji.name === "🏆" && reaction.message.guild.member(user).roles.cache.get("587184713387606017"))) {
		const channel = "848815102664114176";
		let embed = new Discord.MessageEmbed();
		embed.setAuthor(reaction.message.member.displayName, reaction.message.author.avatarURL());
		if (reaction.message.content) embed.setDescription(`**${reaction.message.content}**\nclick [here](${reaction.message.url}) to jump to the message`);
		else embed.setDescription(`click [here](${reaction.message.url}) to jump to the message`);
		if (reaction.message.attachments.size > 0) {
			if (reaction.message.attachments.first().url.includes(".png") || reaction.message.attachments.first().url.includes(".jpg") || reaction.message.attachments.first().url.includes(".jpeg") || reaction.message.attachments.first().url.includes(".gif")) embed.setImage(reaction.message.attachments.first().url);
			client.channels.cache.get(channel).send({
				embed,
			});
		} else
			client.channels.cache.get(channel).send({
				embed,
			});
		reaction.message.react("⭐");
	}
	// / hall of fame
});

client.login(config.QuoCommToken);
