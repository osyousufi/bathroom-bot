const Discord = require('discord.js');
const prefixModel = require('../models/prefixSchema');
const sheeshModel = require("../models/sheeshSchema");
const profileModel = require("../models/profileSchema");


module.exports = {
  async config(client, commands, cooldowns, message) {

    const messageCheck = async (prefix) => {

      if (message.content === 'SHEESH' && message.channel.id == 825656630115827712) {
        await sheeshModel.findByIdAndUpdate("60739b967d146e235000dfc4", {$inc: {Count: 1} });
      }

      //check for profile data, if none, create one
      let profileData;
      try {
        profileData = await profileModel.findOne({ userID: message.author.id });
        if(!profileData) {
          let profile = await profileModel.create({
            userID: message.author.id,
            rupees: 1000,
            bank: 0
          });
          profile.save();
        }
      } catch (err) {
         console.log(err);
      }

      if (!message.content.startsWith(prefix) || message.author.bot) return;


      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if (!command) return; //or return in message.channel: this command doesn't exist

      const errorEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000');


      const { cooldowns } = client;

      if (!cooldowns.has(command.name)) {
      	cooldowns.set(command.name, new Discord.Collection());
      }

      const now = Date.now();
      const timestamps = cooldowns.get(command.name);
      const cooldownAmount = (command.cooldown || 2) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      	if (now < expirationTime) {
      		const timeLeft = (expirationTime - now) / 1000;
          errorEmbed.setTitle(`${message.author.username},`);
          errorEmbed.setDescription(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      		return message.channel.send(errorEmbed);
      	}
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

      try {
        if (command.guildOnly && message.channel.type === 'dm') {
          errorEmbed.setTitle('I can\'t execute that command inside DMs!');
          message.channel.send(errorEmbed);
          return
        }
        else if (command.args && !args.length) {
          let reply = `You didn't provide any arguments, ${message.author.username}!`;
          errorEmbed.setTitle(reply);
          if (command.usage) {
            reply = `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            errorEmbed.setDescription(reply);
          }
          message.channel.send(errorEmbed);
          return
        }
        else if (command.mention && !message.mentions.users.first()){
          let reply = `You didn't mention a user, ${message.author.username}!`;
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
        await command.execute(message, args, profileData);
      } catch (error) {
        console.error(error);
      }

    }

    if (message.channel.type == 'dm'){
      const prefix = "//"
      messageCheck(prefix);
    } else {
      const data = await prefixModel.findOne({
          GuildID: message.guild.id
      });

      if (data) {
        const prefix = data.Prefix;
        messageCheck(prefix);
      } else {
        const prefix = "//"
        messageCheck(prefix);
      }

    }



  }
};
