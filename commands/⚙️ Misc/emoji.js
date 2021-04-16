const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "emoji",
  description: "Retrieve a custom emoji from a server that bathroom bot is in! Get animated emojis without discord nitro!!",
  args: true,
  usage: '<emoji name>',
  aliases: ['emote', 'emoticon'],
  async execute(message, args, profileData, client) {

    const emoji = client.emojis.cache.find(emoji => emoji.name == args);
    if (!emoji) {
      return message.lineReplyNoMention(
        flashEmbed.display('#FF0000', `${message.author.username},`, `Emoji not found. Emojis are case sensitive. Bot must also be in the same server as the emoji!`)
      )
    } else {
      message.delete();
      return message.channel.send(`${emoji}`);
    }

  }
}
