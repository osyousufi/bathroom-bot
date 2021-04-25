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
    if (color == 'black') {
      color = '#000000'
    }
    if (color == 'yellow') {
      color = '#FFFF00'
    }
    if (color == 'orange') {
      color = '#FFA500'
    }
    messageEmbed.setColor(color);
    messageEmbed.setTitle(title);
    messageEmbed.setDescription(description);

    return messageEmbed;
  }
}
