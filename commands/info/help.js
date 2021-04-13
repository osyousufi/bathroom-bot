const Discord = require('discord.js');
const prefix = "//"

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	execute(message, args) {

    const data = [];
    const { commands } = message.client;
		const errorEmbed = new Discord.MessageEmbed()
			.setColor('#FF0000')

		const helpEmbed = new Discord.MessageEmbed()

    if (!args.length) {

			helpEmbed.setTitle('Here\'s a list of all my commands:');
			helpEmbed.addField(`${commands.map(command => command.secret ? null : command.name).join(', ')}`, `You can send \`${prefix}help <command name>\` to get info on a specific command!` )
			message.channel.send(helpEmbed)

    } else {
			const name = args[0].toLowerCase();
	    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

	    if (!command) {
	    	errorEmbed.setTitle(`${message.author.username}, that\'s not a valid command!`);
				message.channel.send(errorEmbed)
	    }

			if (!command || command.secret) {
				return
			} else {
				helpEmbed.setTitle(`${command.name}`);
				if (command.description) helpEmbed.addField(`***Description:***`, `${command.description}`)
				if (command.aliases) helpEmbed.addField(`***Aliases:***`, `${command.aliases.join(', ')}`);
				if (command.usage) helpEmbed.addField(`***Usage:***`, `${prefix}${command.name} ${command.usage}`)
				message.channel.send(helpEmbed);
			}
		}

	}

};
