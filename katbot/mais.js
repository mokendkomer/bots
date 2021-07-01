const config = require('./config.json');
const Discord = require('discord.js');
const ms = require('ms');
const client = new Discord.Client();

client.on('message', (message) => {
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

	if (message.content.toLowerCase().startsWith('kat mute')) {
		const args = message.content.slice(4).split(/ +/);
		const misperms = `⚠️ <@${message.author.id}> You cannot run this command.`;
		const target = message.mentions.users.first();
		if (!message.member.hasPermission([ 'MANAGE_ROLES' ])) return message.channel.send(misperms);
		if (target) {
			let muteRole = message.guild.roles.cache.find((role) => role.name === 'Muted');
			let memberTarget = message.guild.members.cache.get(target.id);
			if (!args[2]) {
				memberTarget.roles.add(muteRole.id);
				message.channel.send(`<@${memberTarget.user.id}> has been muted.`);
				return;
			}
			memberTarget.roles.add(muteRole.id);
			message.channel.send(`<@${memberTarget.user.id}> has been muted for ${ms(args[2])}.`);

			setTimeout(function() {
				memberTarget.roles.remove(muteRole.id);
				message.channel.send(`<@${memberTarget.user.id}> has been unmuted.`);
			}, ms(args[2]));
		} else {
			message.channel.send('Sorry, cannot find the member.');
		}
	}
	if (message.content.toLowerCase().startsWith('kat unmute')) {
		const target = message.mentions.users.first();
		const misperms = `⚠️ <@${message.author.id}> You seem to be missing the permissions to run this command.`;

		if (!message.member.hasPermission([ 'MANAGE_ROLES' ])) return message.channel.send(misperms);

		if (target) {
			let muteRole = message.guild.roles.cache.find((role) => role.name === 'Muted');

			let memberTarget = message.guild.members.cache.get(target.id);

			memberTarget.roles.remove(muteRole.id);
			message.channel.send(`<@${memberTarget.user.id}> has been unmuted.`);
		} else {
			message.channel.send('Sorry, cannot find the member.');
		}
	}
});

client.login(config.katToken);
