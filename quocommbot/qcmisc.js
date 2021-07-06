const config = require('../../json/config.json')
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', async (message) => {
		if(message.channel.id === "861765154768289862"){
			if(message.embeds[0] && message.embeds[0].image.url === 'https://disboard.org/images/bot-command-image-bump.png')
				setTimeout(() => message.channel.send(`GO BUMP :rage: <@&862020101544345600>`), 7200000);
			if (message.content.toLowerCase() !== '!d bump' && !message.author.bot)
				message.delete();
		}
});

client.login(config.QuoCommToken);
