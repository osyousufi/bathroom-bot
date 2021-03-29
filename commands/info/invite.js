const Discord = require('discord.js');

module.exports = {
	name: 'invite',
	aliases: ['inv'],
	description: 'Displays invite link of the bot.',
	execute(message, args) {
		const invite = new Discord.MessageEmbed()
      .addField("Invite Link", "You can invite this bot to any server by clicking [here](https://discord.com/oauth2/authorize?client_id=820429062676938823&scope=bot)")
    message.channel.send(invite);
	},
};
