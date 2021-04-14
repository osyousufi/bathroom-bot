const fs = require('fs');
const commandFolders = fs.readdirSync('./commands/');
const Discord = require('discord.js');

module.exports = {

  load(client, commands) {

    for (let folder of commandFolders) {
    	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    	for (let file of commandFiles) {
    		const command = require(`../commands/${folder}/${file}`);
    	  commands.set(command.name, command);
    	}
    }

  }
}
