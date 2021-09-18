const config = require("../../json/config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const cron = require("node-cron");
const fs = require("fs");

const mokendDm = "845575192688459786";
const srijaDm = "845575380970504224";
const favchannel = "856942237450240051";
const prodchannel = "888754883971416124";

const emoji = "<:angycat:856502599225835570>";
const mokendbear = "<:mokendlove:793852414905155634>";
const srijabear = "<:srijalove:793852415228903474>";

let mokendfav = `Probably that time when he ignored my DMs when I asked what his favorite part was ${emoji}`;
let srijafav = `Probably that time when she ignored my DMs when I asked what her favorite part was ${emoji}`;
let mokendprod = {
	activities: "nono he was busy being a wastemokend",
	satisfied: "",
	reason: "",
};
let srijaprod = {
	activities: "nono she was busy being a wastesrija",
	satisfied: "",
	reason: "",
};
cron.schedule(
	"30 23 * * *",
	() => {
		client.users.fetch(mokendDm).then((mokend) => mokend.send("Hewwo mokend mokend! What pwoductive things did you do today"));
		client.users.fetch(srijaDm).then((srija) => srija.send("Oioi srija srija! What pwoductive things did you do today?"));
		mokendprod.activities = "nono he was busy being a wastemokend";
		srijaprod.activities = "nono she was busy being a wastesrija";
	},
	{
		scheduled: true,
		timezone: "Asia/Kolkata",
	}
);
cron.schedule(
	"59 23 * * *",
	() => {
		client.users.fetch(mokendDm).then((mokend) => mokend.send("Oioi Mokend Mokend! What was your favorite part of todayy? 💙"));
		client.users.fetch(srijaDm).then((srija) => srija.send("Ello Srija! What was your favorite part of todayy? 💙"));
		mokendfav = `Probably that time when he ignored my DMs when I asked what his favorite part was ${emoji}`;
		srijafav = `Probably that time when she ignored my DMs when I asked what her favorite part was ${emoji}`;

		let mokendEmbed = new Discord.MessageEmbed()
			.setColor("#0a9ba6")
			.setAuthor("Mokendbear", client.users.cache.get(mokendDm).avatarURL())
			.setTitle(`Mukund's productivity for today! ${mokendbear}`)
			.setDescription(`**Things done**\n${mokendprod.activities}\n\n Mokend is ${mokendprod.satisfied.startsWith("y") ? "happy" : "not happy"} with his productivity today ${mokendprod.satisfied.startsWith("y") ? "" : "becasue " + mokendprod.reason}`);
		let srijaEmbed = new Discord.MessageEmbed()
			.setColor("#0a9ba6")
			.setAuthor("Srijabear", client.users.cache.get(srijaDm).avatarURL())
			.setTitle(`Srija's productivity for today!  ${srijabear}`)
			.setDescription(`**Things done**\n${srijaprod.activities}\n\n Srija is ${srijaprod.satisfied.startsWith("y") ? "happy" : "not happy"} with her productivity today ${srijaprod.satisfied.startsWith("y") ? "" : "becasue " + srijaprod.reason}`);

		client.channels.cache.get(prodchannel).send(mokendEmbed);
		client.channels.cache.get(prodchannel).send(srijaEmbed);
	},
	{
		scheduled: true,
		timezone: "Asia/Kolkata",
	}
);

cron.schedule(
	"0 3 * * *",
	() => {
		sendfav();
	},
	{
		scheduled: true,
		timezone: "Asia/Kolkata",
	}
);

client.on("ready", () => {
	console.log(`ye i work ez`);
	client.user.setActivity("being big cute", {
		type: "PLAYING",
	});
});

process.on("unhandledRejection", (error) => {
	bigerror(`name: ${error.name}\nmessage: ${error.message}\npath: ${error.path}\ncode: ${error.code}\nmethod: ${error.method}`);
});

client.on("message", async (message) => {
	if (message.channel.type === "dm" && !message.author.bot) {
		if (message.author.id === mokendDm) {
			if (mokendprod.activities.startsWith("nono")) {
				mokendprod.activities = message.content;
				message.channel.send("oki okiii, awe you happy wif how pwoductive you woww?");
			} else if (mokendprod.satisfied === "") {
				mokendprod.satisfied = message.content;
				if (message.content.startsWith("n")) message.channel.send("owwiee oki, and is theow any weason fow that");
				else message.channel.send("okii fank woo fow hewping wif yow answows todayy MWAH :cookie:");
			} else if (mokendprod.satisfied.startsWith("n") && mokendprod.reason === "") {
				mokendprod.reason = message.content;
				message.channel.send("fank woo fow hewping me wif yow answows todayyy MWAHH :cookie:");
			} else {
				mokendfav = message.content;
				if (message.content.length > 2048) {
					message.channel.send(`Oh no! This is tooo big s m h. Twiii sending something that I can wemembewww hmpff ${emoji}`);
					mokendfav = `He sent something that's too big for me to wemembewwww ${emoji}`;
					return;
				} else {
					message.channel.send(`Yayaayay! I can send this thing when it's the right time hehehe!`);
				}
			}
		} else if (message.author.id === srijaDm) {
			if (srijaprod.activities.startsWith("nono")) {
				srijaprod.activities = message.content;
				message.channel.send("oki okiii, awe you happy wif how pwoductive you woww?");
			} else if (srijaprod.satisfied === "") {
				srijaprod.satisfied = message.content;
				if (message.content.startsWith("n")) message.channel.send("owwiee oki, and is theow any weason fow that");
				else message.channel.send("okii fank woo fow hewping wif yow answows todayy MWAH :cookie:");
			} else if (srijaprod.satisfied.startsWith("n") && srijaprod.reason === "") {
				srijaprod.reason = message.content;
				message.channel.send("fank woo fow hewping me wif yow answows todayyy MWAHH :cookie:");
			} else {
				srijafav = message.content;
				if (message.content.length > 2048) {
					message.channel.send(`Oh no! This is tooo big s m h. Twiii sending something that I can wemembewww hmpff ${emoji}`);
					srijafav = `She sent something that's too big for me to wemembewwww ${emoji}`;
					return;
				} else {
					message.channel.send(`Yayaayay! I can send this thing when it's the right time hehehe!`);
				}
			}
		}
	}
	if (message.content.toLowerCase() === "send cute" && !message.author.bot) {
		sendfav();
		message.delete();
	}
});

function sendfav() {
	let mokendEmbed = new Discord.MessageEmbed().setColor("#0a9ba6").setAuthor("Mokendbear", client.users.cache.get(mokendDm).avatarURL()).setTitle(`Mukund's favorite parts of yesterday! ${mokendbear}`).setDescription(mokendfav);

	let srijaEmbed = new Discord.MessageEmbed().setColor("#0a9ba6").setAuthor("Srijabear", client.users.cache.get(srijaDm).avatarURL()).setTitle(`Srija's favorite parts of yesterday!  ${srijabear}`).setDescription(srijafav);

	client.channels.cache.get(favchannel).send(mokendEmbed);
	client.channels.cache.get(favchannel).send(srijaEmbed);
}

const bigerror = (error) => {
	fs.writeFileSync("./errorthing.txt", error);
	client.users.cache.get(mokendDm).send("Ohnoo! Something poopy happened!");
	client.users.cache.get(mokendDm).send("Poopy error file", {
		files: ["./errorthing.txt"],
	});
	client.users.cache.get(srijaDm).send("Ohnoo! Something poopy happened!");
	client.users.cache.get(srijaDm).send("Poopy error file", {
		files: ["./errorthing.txt"],
	});
};

client.login(config.teslaToken);
