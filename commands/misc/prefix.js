const prefixModel = require("../../models/prefixSchema");
const Discord = require('discord.js');

module.exports = {
  name: "prefix",
  guildOnly: true,
  aliases: ['sp'],
  perms: 'KICK_MEMBERS',
  async execute(message, args) {

    const data = await prefixModel.findOne({
        GuildID: message.guild.id
    });

    const flashEmbed = new Discord.MessageEmbed()
			.setColor('#FF0000');

    if (!args[0]) {
      flashEmbed.setTitle(`Current prefix is: **\`${data ? data.Prefix : '//'}\`**`);
      flashEmbed.setColor('#000000');
      return message.channel.send(flashEmbed);
    }
    if (args[0].length > 5) {
      flashEmbed.setTitle('Your new prefix must be under \`5\` characters!');
      return message.channel.send(flashEmbed);
    }

    if (data) {
        await prefixModel.findOneAndRemove({
            GuildID: message.guild.id
        })
        flashEmbed.setTitle(`The new prefix is now **\`${args[0]}\`**`);
        flashEmbed.setColor('#00FF00');
        message.channel.send(flashEmbed);

        let newData = new prefixModel({
            Prefix: args[0],
            GuildID: message.guild.id
        })
        newData.save();
    } else if (!data) {
        flashEmbed.setTitle(`The new prefix is now **\`${args[0]}\`**`);
        flashEmbed.setColor('#00FF00');
        message.channel.send(flashEmbed);

        let newData = new prefixModel({
            Prefix: args[0],
            GuildID: message.guild.id
        })
        newData.save();
    }



  }
}
