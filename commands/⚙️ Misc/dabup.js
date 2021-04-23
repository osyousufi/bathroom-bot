const Discord = require('discord.js');

module.exports = {
	name: 'dabup',
	args: true,
	guildOnly: true,
	mention: true,
	usage: '<@username>',
	aliases: ['dab', 'du'],
	description: 'Dab up a homie!',
	execute(message, args) {
    const taggedUser = message.mentions.users.first();
    const dabUp = new Discord.MessageEmbed()
      .setTitle(`${message.author.username} dabs up ${taggedUser.username}`)
      .setImage('https://i.imgur.com/35Y9PHQ.gif')
    return message.channel.send(dabUp);
  }
};
