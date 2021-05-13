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


let debugMode = true

client.on('message', (message) => {

  if (message.author.id == 267504730341769219 && message.content == '//debug' && !debugMode) {
    debugMode = true
    return message.channel.send('debug mode on!')
  } else if (message.author.id == 267504730341769219 && message.content == '//debug' && debugMode) {
    debugMode = false
    return message.channel.send('debug mode off!')
  }

  if (debugMode) {

    if ( (message.author.id !== 267504730341769219) && (message.content.startsWith('//')) ) {
      return message.channel.send('bot is in debug mode and is currently unavailable!')
    }

  } else {
    commandHandler.config(client, client.commands, client.cooldowns, message)
  }

});


client.login(process.env.DISCORD_BOT_TOKEN);
