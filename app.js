const Discord = require("discord.js");
const token = require('./data/token.json');
const handler = require('./handler')
const express = require('express')


const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});


client.login(token.BOT_TOKEN.split("").reverse().join(""));

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.redirect("https://youtu.be/QOowQeKyNkQ?t=52")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
	client.on("messageCreate", function(message) {
		console.log(message.author)

		if (message.author.bot) return;
		if (!message.content.startsWith(token.PREFIX)) return;

		const commandBody = message.content.slice(token.PREFIX.length);
		const args = commandBody.split(' ');
		const command = args.shift().toLowerCase();

		handler(message, command)
	});
})


