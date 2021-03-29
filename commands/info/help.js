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
			helpEmbed.addField(`${commands.map(command => command.name).join(', ')}`, `You can send \`${prefix}help [command name]\` to get info on a specific command!` )
			message.author.send(helpEmbed)
      	.then(() => {
      		if (message.channel.type === 'dm') return;
					errorEmbed.setColor('#00FF00')
      		errorEmbed.setTitle(`${message.author.username}, I\'ve sent you a DM with all my commands!`);
					message.channel.send(errorEmbed);
      	})
      	.catch(error => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
          errorEmbed.addField(`${message.author.username}, it seems like I can\'t DM you!`, "Do you have [DMs disabled?](https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-)")
          message.channel.send(errorEmbed);
      	});
    } else {
			const name = args[0].toLowerCase();
	    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

	    if (!command) {
	    	errorEmbed.setTitle(`${message.author.username}, that\'s not a valid command!`);
				message.channel.send(errorEmbed)
	    }

			helpEmbed.setTitle(`${command.name}`);
			if (command.description) helpEmbed.addField(`***Description:***`, `${command.description}`)
			if (command.aliases) helpEmbed.addField(`***Aliases:***`, `${command.aliases.join(', ')}`);
			if (command.usage) helpEmbed.addField(`***Usage:***`, `${prefix}${command.name} ${command.usage}`)
			message.channel.send(helpEmbed);
		}
	}

};
