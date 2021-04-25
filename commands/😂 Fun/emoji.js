const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "emoji",
  description: "Retrieve a custom emoji from a server that bathroom bot is in!",
  args: true,
  usage: '<emoji name> [r(optional), id(optional)]',
  aliases: ['emote', 'emoticon'],
  async execute(message, args, profileData, client) {

    try {

      const emoji = client.emojis.cache.find(emoji => emoji.name == args[0]);

      if (!emoji) {
        message.delete();
        return message.channel.send(
          flashEmbed.display('#FF0000', `${message.author.username},`, `Emoji not found. Emojis are case sensitive. Bot must also be in the same server as the emoji!`)
        )
      } else {
        if (args[1] === 'r' || args[1] === 'react') {
          await message.delete();
          message.client.channels.fetch(message.channel.id).then(channel => {
            channel.messages.fetch({limit: 1}).then(async message => {

              let lastMessage = message.first();
              await setTimeout(() => {
                return lastMessage.react(`${emoji}`);
              }, 1000)

            })
          });
          return
        } else if (args[1] === 'id') {
          await message.delete();
          return message.channel.send(`${emoji.id}`);
        } else {
          message.delete();
          return message.channel.send(`${emoji}`);
        }
      }

    } catch (e) {
      console.log(e)
    }


  }
}
