const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', async (message) => {
	if (message.content.toLowerCase() !== '!d bump' && message.channel.id === "859494849429766184" && !message.author.bot)
		message.delete();
	if (message.content.toLowerCase().startsWith('kat kick')) {
		const misperms = `⚠️ <@${message.author.id}> You seem to be missing the permissions to run this command.`;
		const badkick = `⚠️ <@${message.author.id}> Please mention a user and try again.`;
		const noself = `⚠️ <@${message.author.id}> You cannot kick yourself.`;
		if (!message.member.hasPermission([ 'KICK_MEMBERS' ])) return message.channel.send(misperms);
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
						message.channel.send('User cannot be kicked.');
						console.log(err);
					});
			} else {
				message.reply('Cannot find user.');
			}
		}
	}
	if (message.content.toLowerCase().startsWith('kat ban')) {
		const misperms = `⚠️ <@${message.author.id}> You seem to be missing the permissions to run this command.`;
		const badban = `⚠️ <@${message.author.id}> Please mention a user and try again.`;
		const noself = `⚠️ <@${message.author.id}> You cannot ban yourself.`;
		if (!message.member.hasPermission([ 'BAN_MEMBERS' ])) return message.channel.send(misperms);
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
						message.channel.send('User cannot be banned.');
						console.log(err);
					});
			} else {
				message.reply('Cannot find user');
			}
		}
	}
});

client.login(config.katToken);
