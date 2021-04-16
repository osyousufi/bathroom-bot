const prefixModel = require("../../models/prefixSchema");
const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "prefix",
  guildOnly: true,
  aliases: ['sp', 'setprefix'],
  // perms: 'ADMINISTRATOR',
  async execute(message, args) {

    const data = await prefixModel.findOne({
        GuildID: message.guild.id
    });

    if (!args[0]) {
      return message.channel.send(
        flashEmbed.display('#000000', `${message.author.username},`, `Current prefix is: **\`${data ? data.Prefix : '//'}\`**`)
      );
    }

    if (args[0].length > 5) {
      return message.channel.send(
        flashEmbed.display('#FF0000', `${message.author.username},`, 'Your new prefix must be under \`5\` characters!')
      );
    }

    if (data) {
        await prefixModel.findOneAndRemove({
            GuildID: message.guild.id
        });

        message.channel.send(
          flashEmbed.display('#00FF00', `${message.author.username},`, `The new prefix is now **\`${args[0]}\`**`)
        );

        let newData = new prefixModel({
            Prefix: args[0],
            GuildID: message.guild.id
        });
        newData.save();
    } else if (!data) {
        message.channel.send(
          flashEmbed.display('#00FF00', `${message.author.username},`, `The new prefix is now **\`${args[0]}\`**`)
        );

        let newData = new prefixModel({
            Prefix: args[0],
            GuildID: message.guild.id
        });
        newData.save();
    }



  }
}
