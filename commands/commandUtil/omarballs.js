const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "omarballs",
  description: "yeahhhhh!!!!",
  async execute(message, args, profileData, client, prefix) {

    const bruh = new Discord.MessageEmbed()
      .setTitle('suck my balls bitch!!!!!!!!!!!!!!')
      .setImage('https://i.imgur.com/EHZhhRe.png')

    return message.channel.send(bruh)
  }
}
