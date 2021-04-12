const Discord = require('discord.js');

module.exports = {
  async config(client, commands, message) {

    const prefix = require('./models/prefix-model');
    const sheeshModel = require("./models/sheesh-model");

    const errorCheck = async (prefix) => {

      if (message.content === 'SHEESH' && message.channel.id == 825656630115827712) {
        await sheeshModel.findByIdAndUpdate("60739b967d146e235000dfc4", {$inc: {Count: 1} });
      }

      if (!message.content.startsWith(prefix) || message.author.bot) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if (!command) return;

      const errorEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000');

      try {
        if (command.guildOnly && message.channel.type === 'dm') {
          errorEmbed.setTitle('I can\'t execute that command inside DMs!');
          message.channel.send(errorEmbed);
          return
        }
        else if (command.args && !args.length) {
          let reply = `You didn't provide any arguments, ${message.author.username}! owned NOOB HAHAHA XDD`;
          errorEmbed.setTitle(reply);
          if (command.usage) {
            reply = `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            errorEmbed.setDescription(reply);
          }
          message.channel.send(errorEmbed);
          return
        }
        else if (command.mention && !message.mentions.users.first()){
          let reply = `You didn't mention a user, ${message.author.username}! LOL IDIEOT owned LAYMOO!!! XD`;
          errorEmbed.setTitle(reply);
          if (command.usage) {
            reply = `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            errorEmbed.setDescription(reply);
          }
          message.channel.send(errorEmbed);
          return
        } else if (command.perms && !message.member.hasPermission(command.perms)) {
          errorEmbed.setTitle(`You dont have perms for this, ${message.author.username}, LOL get owned liberal!!! LMAO!`)
          message.channel.send(errorEmbed);
          return
        }

        command.execute(message, args);
      } catch (error) {
        console.error(error);
      }

    }

    if (message.channel.type == 'dm'){
      const prefix = "//"
      errorCheck(prefix);
    } else {
      const data = await prefix.findOne({
          GuildID: message.guild.id
      });

      if (data) {
        const prefix = data.Prefix;
        errorCheck(prefix);
      } else {
        const prefix = "//"
        errorCheck(prefix);
      }

    }



  }
};
