const Discord = require('discord.js');
const fs = require('fs');
const commandFolders = fs.readdirSync('./commands/');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	catagory: 'info',
	execute(message, args, profileData, client, prefix) {

    const data = [];
    const { commands } = message.client;

		const imageUrl = client.users.cache.find(user => user.id == '267504730341769219').displayAvatarURL();

		const helpEmbed = new Discord.MessageEmbed()
			.setAuthor('Bathroom Bot', `${client.user.displayAvatarURL()}`)
			.setFooter('© osyou#2095', `${imageUrl}`)

    if (!args.length) {

			for (let folder of commandFolders) {
				if (folder == 'commandUtil') {
				} else {
					const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
					let commandStorage  = [];
		    	for (let file of commandFiles) {
		    		const command = require(`../../commands/${folder}/${file}`);
						commandStorage.push(`\`${command.name}\``)
		    	}
					helpEmbed.addField(`${folder}`, `${commandStorage.join(', ')}`)
				}
			}
			helpEmbed.setDescription(`You can send **\`${prefix}help <command name>\`** to get info on a specific command!`)
			return message.channel.send(helpEmbed)

    } else {
			const name = args[0].toLowerCase();
	    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

	    if (!command) {
				message.lineReply(
					flashEmbed.display('red',`${message.author.username},`, `That's not a valid command!`)
				)
	    }

			if (!command || command.secret) {
				return
			} else {
				helpEmbed.setTitle(`${command.name}`);
				if (command.description) helpEmbed.addField(`***Description:***`, `${command.description}`)
				if (command.aliases) helpEmbed.addField(`***Aliases:***`, `${command.aliases.join(', ')}`);
				if (command.usage) helpEmbed.addField(`***Usage:***`, `${prefix}${command.name} ${command.usage}`)
				return message.channel.send(helpEmbed);
			}
		}

	}

};
