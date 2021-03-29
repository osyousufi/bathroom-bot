require('dotenv').config();

const Discord = require('discord.js');
const mongoose = require('mongoose');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandHandler = require('./command-handler');
const commandLoader = require('./command-loader');
commandLoader.load(client, client.commands);


client.once('ready', async () => {
	console.log('Ready!');
});

mongoose.connect(process.env.MONGO_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
		useFindAndModify: false
});


client.on('message', (message) => {
  commandHandler.config(client, client.commands, message)

});



client.login(process.env.DISCORD_BOT_TOKEN);
