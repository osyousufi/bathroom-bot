const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "emoji",
  description: "Retrieve a custom emoji from a server that bathroom bot is in!",
  args: true,
  usage: '<emoji name> <text>(optional, null) react(optional)',
  aliases: ['emote', 'emoticon'],
  async execute(message, args, profileData, client) {

    try {

      const emoji = client.emojis.cache.find(emoji => emoji.name == args[0]);
      const text = args[1];

      if (!emoji) {
        message.delete();
        return message.channel.send(
          flashEmbed.display('#FF0000', `${message.author.username},`, `Emoji not found. Emojis are case sensitive. Bot must also be in the same server as the emoji!`)
        )
      } else {
        if (args[2] === 'react' || args[2] === 'r') {
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
        } else {

          message.delete();
          if (text === 'none', text === 'null') {
            return message.channel.send(`${emoji}`);
          } else {
            return message.channel.send(`${text} ${emoji}`);
          }

        }
      }

    } catch (e) {
      console.log(e)
    }


  }
}
