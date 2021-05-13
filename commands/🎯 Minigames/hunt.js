const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();
const profileModel = require('../../models/profileSchema');

module.exports = {
  name: "hunt",
  cooldown: 60,
  description: "Go hunting! Requires a hunting rifle.",
  async execute(message, args, profileData, client, prefix) {

    return message.channel.send('work in progress!')
  }
}
