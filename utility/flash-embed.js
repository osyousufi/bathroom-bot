const Discord = require('discord.js');
const messageEmbed = new Discord.MessageEmbed();

module.exports = {
  display(color, title, description) {
    if (color == 'red') {
      color = '#FF0000'
    }
    if (color == 'green') {
      color = '#00FF00'
    }
    messageEmbed.setColor(color);
    messageEmbed.setTitle(title);
    messageEmbed.setDescription(description);

    return messageEmbed;
  }
}
