const config = require('../config.json');
const Discord = require('discord.js');
const ms = require('ms');
const client = new Discord.Client();

client.on('message', (message) => {
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
