require('dotenv').config();

const Discord = require('discord.js');
const mongoose = require('mongoose');
require('discord-reply');
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandHandler = require('./utility/command-handler');
const commandLoader = require('./utility/command-loader');
const eventHandler = require('./utility/event-handler');

module.exports = client;

mongoose.connect(process.env.MONGO_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
		useFindAndModify: false,
    useCreateIndex: true,
}).then(() => {
  console.log('connected to mongodb');
}).catch((err) => {
  console.log(err);
})

client.on('ready', async () => {
  commandLoader.load(client, client.commands);
  eventHandler.load(client);
  client.user.setActivity("//help | WIP!");
	console.log('Ready!');

});

client.on('message', (message) => {
  commandHandler.config(client, client.commands, client.cooldowns, message)
});


client.login(process.env.DISCORD_BOT_TOKEN);
