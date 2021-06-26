const config = require('../config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', async (message) => {
	if (message.content.toLowerCase().startsWith('kat purge')) {
		const misperms = `⚠️ <@${message.author.id}> You seem to be missing the permissions to run this command.`;
		if (!message.member.hasPermission([ 'MANAGE_MESSAGES' ])) return message.channel.send(misperms);
		const args = message.content.slice(4).split(/ +/);
		if (!args[1])
			return message.channel.send(
				`⚠️ <@${message.author.id}> Please enter the amount of messages you want to purge.`
			);
		if (isNaN(args[1])) return message.channel.send(`⚠️ <@${message.author.id}> Please enter a real number.`);
		if (args[1] > 100)
			return message.channel.send(`⚠️ <@${message.author.id}> You cannot delete more than 100 messages.`);
		if (args[1] < 1)
			return message.channel.send(`⚠️ <@${message.author.id}> You must delete at least one message.`);
		await message.channel.messages.fetch({ limit: ++args[1] }).then((messages) => {
			message.channel.bulkDelete(messages);
		});
	}
});

client.login(config.katToken);
