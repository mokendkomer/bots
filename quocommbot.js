const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const pendingVerification = `587744410498760707`;
const verification = `587156836205985793`
const member = `587187354851082250`
const readme = `587156775346765834`
const park = `587321519051636776`
const verifiers =  require('../verifiers.json')
const findVerifier = (id) => {
	return verifiers.find(person => person.id === id)
}

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
	if(message.channel.type !== "dm")
	  return;
	  const args = message.content.toLowerCase().split(" ")
	if(
		args[0] !== "q.ask" &&
		args[0] !== "q.vent" &&
		args[0] !== "q.vent1" &&
		args[0] !== "q.vent2"
		// args[0] !== "q.report"
	) return;
	const member = client.guilds.cache.get('587139618999369739').member(message.author.id)
	if(!member || !member.roles.cache.some(role => role.id === '587187354851082250'))
		return message.channel.send(`do i even know you lol`)
	if(member.roles.cache.some(role => role.id === '751530631489650738'))
		return message.channel.send(`lol you tried x`)
	let channel = "", prompt = "", substring = 0;
		if(args[0].toLowerCase() === "q.ask"){
		channel = "639902815849938975";
		prompt = "Thank you for your question!";
		substring = args[0].length + 1;
		}
		if(args[0].toLowerCase() === "q.vent" || args[0].toLowerCase() === "q.vent1"){
		channel = "739150769722228806";
		prompt = "Your message has been sent. Take care!";
		substring = args[0].length + 1;
		}
		if(args[0].toLowerCase() === "q.vent2"){
		channel = "793407631066005554";
		prompt = "Your message has been sent. Take care!";
		substring = args[0].length + 1;
		}
		if(message.content.includes('@everyone') || message.content.includes('@here') || message.content.includes('<@'))
		return message.channel.send(`Your message is not allowed to ping anyone.`)
		client.channels.cache.get('587219379456966701').send(`${member.displayName} sent ${message.content.substring(substring)} in <#${channel}>`);
		client.channels.cache.get(channel).send(`${message.content.substring(substring)}`);
		message.channel.send(prompt);
});

client.on('guildMemberAdd', newMember => {
	if(newMember.user.bot)
	return;
	
	let embed = new Discord.MessageEmbed;
	embed.setTitle('A user joined');
	embed.setDescription('React with :white_check_mark: to verify them')
	embed.addFields(
		{ name: `Name`, value: newMember.displayName },
		{ name: `Mention`, value: `<@${newMember.id}>` }
	);
	embed.setFooter(newMember.id)
	client.channels.cache.get(pendingVerification).send(embed).then(msg => msg.react('✅'));
});

client.on('messageReactionAdd', async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	if(user.bot || reaction.count > 2 || reaction.message.channel.id !== pendingVerification)
		return;
	let verifier = {};
	verifier = findVerifier(user.id);
	if(!verifier)
		return;

	let message = reaction.message
	let embed = message.embeds[0];
	if(embed.title === "A user joined" && reaction.emoji.name === "✅"){
		client.channels.cache.get(verification).send(`Welcome to QuoComm <@${embed.footer.text}>! Please follow the steps as they are written.\n\n1. Please send your Quora  name here.\n2. Send \`${Math.floor(100000 + Math.random() * 900000)}\` to <${verifier.link}> in Quora DMs to verify yourself.\n3. Verification may take a few minutes, so feel free to read through #read-me while you wait.\n\nIf you need help, please ping an online moderator and they will shortly assist you.`)
		embed.setTitle(`Pending verification`);
		embed.setDescription(`The verifier is ${user.username}`)
		message.edit(embed).then(msg => {
		// message.channel.send(embed).then(msg => {
			msg.reactions.removeAll();
			msg.react('✅');
			msg.react('🤬');
		})
	} else if(embed.title === "Pending verification" && reaction.emoji.name === "✅"){
		try{
			let newMember = message.guild.members.cache.get(embed.footer.text);
			newMember.setNickname(embed.fields[0].value)
			newMember.roles.add(message.guild.roles.cache.get(member))
		} catch (err) {
			console.log(err);
		}
	} else if(embed.title === "Pending verification" && reaction.emoji.name === "🤬"){
		try{
			message.channel.send(`Enter the new nickname`)
				const messageFilter = (m) =>
				m.author.id !== client.user.id 
			  const msgCollector = message.channel.createMessageCollector(
				messageFilter,
				{ time: 10000 }
			  );
			  msgCollector.on("collect", (m) => {
				msgCollector.stop();
				embed.fields[0].value = m.content;
				message.edit(embed)
			  })
		} catch (err) {
			console.log(err)
		}
	}
})

client.on('guildMemberUpdate', (oldMember, newMember) => {
	if (!oldMember.roles.cache.get(member) && newMember.roles.cache.get(member))
		client.channels.cache.get(park).send(`Welcome to QuoComm <@${newMember.id}> \nBe sure to <#${readme}>`);
})


client.login(config.QuoCommToken)