const config = require("../../json/config.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const cron = require("node-cron");

const srijaDm = "845575380970504224";
const angymokend = "<:mokendangy:793852416213647371>";

client.on("ready", () => {
	console.log(`yessooo I do the big workie khekhekhe`);
});

//activity setter
cron.schedule(
	"0 9 * * *",
	() => {
		client.user.setActivity("with wittol swijaa ", { type: "PLAYING" });
	},
	{
		scheduled: true,
		timezone: "Asia/Kolkata",
	}
);

cron.schedule(
	"0 21 * * *",
	() => {
		client.user.setActivity("in moi dweams ", { type: "PLAYING" });
	},
	{
		scheduled: true,
		timezone: "Asia/Kolkata",
	}
);

//study reminder
cron.schedule(
	"0 9-23 * * *",
	() => {
		client.users.cache.get(srijaDm).send(`Ewwo Swwija! Okkiiii I hope you awwe using youww toime wisewyy, or ewse me cwii ${angymokend}`);
	},
	{
		scheduled: true,
		timezone: "Asia/Kolkata",
	}
);

cron.schedule(
	"0 0 * * *",
	() => {
		client.users.cache.get(srijaDm).send(`Ello Srija! Okkiiii I hope you are using youww toime wisewyy, or ewse me cwii ${angymokend} Alsoooo go sleep soono`);
	},
	{
		scheduled: true,
		timezone: "Asia/Kolkata",
	}
);

//checkin image reminder
cron.schedule(
	"0 20 * * *",
	() => {
		client.users.cache.get(srijaDm).send(`Hewwoo!! Can you check if someone has done the check in already and if not can you send a cute image for them khekhekhekhe`);
	},
	{
		scheduled: true,
		timezone: "Asia/Kolkata",
	}
);

client.login(config.littleMokendToken);
