const config = require('../config.json')
const Discord = require("discord.js");
const client = new Discord.Client({
  partials: ['MESSAGE', 'REACTION']
});
const emojiname = ["whiteflower", "blueflower", "greenflower", "pinkflower", "deeppinkflower", "blackflower", "deeppurpleflower", "purpleflower", "orangeflower", "redflower", "tealflower", "yellowflower", "🎉", "🔈", "🎮", "♂️", "♀️", "💟", "redheart", "whiteheart", "greenheart", "blueheart", "purpleheart", "pinkheart", "yellowheart", "bluebutterfly", "pinkbutterfly", "whitebutterfly", "yellowbutterfly", "greenbutterfly1", "cyanbutterfly1"];
const rolename = ["Dissociative Identity", "Antisocial Personality", "Eating Disorder", "PTSD", "Depression", "Schizophrenia", "Anxiety Disorder", "OCD", "Bipolar Disorder", "Borderline Personality", "ADHD", "Autism Spectrum Disorder", "Event Pings", "VC", "Gaming", "Male", "Female", "Other", "Anger Issues", "Emotional Unease", "Gender Dysphoria", "Panic Attacks", "Paranoia", "Self-harm", "Trust Issues", "He/Him", "She/Her", "They/Them", "Unsure/Other", "Self Help", "Supporter"];

client.on("messageReactionAdd", async (reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.log('Something went wrong when fetching the message: ', error);
      return;
    }
  }

  if (reaction.message.channel.id === "805250027396005952" && user && !user.bot && reaction.message.channel.guild) {
    reaction.users.remove(user.id);
    for (let emoji in emojiname)
      if (reaction.emoji.name === emojiname[emoji]) {
        let role = reaction.message.guild.roles.cache.find(e => e.name == rolename[emoji]);
        if (reaction.message.guild.member(user).roles.cache.some(role => role.name == rolename[emoji]))
          reaction.message.guild.member(user).roles.remove(role).catch(console.error)
        else
          reaction.message.guild.member(user).roles.add(role).catch(console.error)
      }
  }
});

client.login(config.katToken);