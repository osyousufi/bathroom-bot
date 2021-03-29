const fs = require('fs');
const commandFolders = fs.readdirSync('./commands');
const Discord = require('discord.js');

module.exports = {
  load(client, commands) {

    for (const folder of commandFolders) {
    	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    	for (const file of commandFiles) {
    		const command = require(`./commands/${folder}/${file}`);
    	  commands.set(command.name, command);
    	}
    }
  }
}
