const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "emoji",
  description: "Retrieve a custom emoji from a server that bathroom bot is in! Get animated emojis without discord nitro!!",
  args: true,
  usage: '<emoji name> react(optional)',
  aliases: ['emote', 'emoticon'],
  async execute(message, args, profileData, client) {

    const emoji = client.emojis.cache.find(emoji => emoji.name == args[0]);
    if (!emoji) {
      message.delete();
      return message.channel.send(
        flashEmbed.display('#FF0000', `${message.author.username},`, `Emoji not found. Emojis are case sensitive. Bot must also be in the same server as the emoji!`)
      )

    } else {

      if (args[1] === 'react' || args[1] === 'reaction' || args[1] === 'r') {
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
        return message.channel.send(`${emoji}`);
      }


    }

  }
}
