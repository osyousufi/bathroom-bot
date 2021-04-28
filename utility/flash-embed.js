const Discord = require('discord.js');
const messageEmbed = new Discord.MessageEmbed();

module.exports = {
  display(color, title, description) {
    messageEmbed.setColor(color);
    messageEmbed.setTitle(title);
    messageEmbed.setDescription(description);

    return messageEmbed;
  }
}
