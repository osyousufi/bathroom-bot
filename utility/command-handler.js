const Discord = require('discord.js');
const prefixModel = require('../models/prefixSchema');
const profileModel = require("../models/profileSchema");
const flashEmbed = require('./flash-embed.js');
const prettyMilliseconds = require('pretty-ms');
const profileHandler = require('./profile-handler.js');

module.exports = {
  async config(client, commands, cooldowns, message) {

    const debugMode = false;

    const messageCheck = async (prefix) => {

      if (debugMode) {

        if (!message.author.bot && message.content.startsWith(prefix) ) {
          if (message.author.id !== "267504730341769219") {
            return message.channel.send('bot is in debug mode and is currently unavailable!')
          }
        }

      }

      if (message.content == ('<@!820429062676938823>')) {
        message.channel.send(
          flashEmbed.display(`DARK_PURPLE`, `${message.author.username}`, `My prefix is: \`${prefix}\``)
        )
      }


      //check for profile data, if none, create one
      let profileData;
      try {
        profileData = await profileModel.findOne({ userID: message.author.id });

        // profileModel.updateMany({}, {rlStats: {wins: 0, losses: 0}}, (err, items) => {})
        if(!profileData) {
          profileHandler.set(profileModel, message.author);
        }
      } catch (err) {
         console.log(err);
      }


      if (!message.content.startsWith(prefix) || message.author.bot) return;


      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      if (!command) return;

      try {
        if (command.guildOnly && message.channel.type === 'dm') {

          return message.lineReply(
            flashEmbed.display('RED', `${message.author.username},`, 'I can\'t execute that command inside DMs!')
          );

        }
        else if (command.args && !args.length) {
          let reply = flashEmbed.display('RED', `${message.author.username},`, `You didn't provide any arguments!`);
          if (command.usage) {
            reply = flashEmbed.display('RED', `${message.author.username},`, `You didn't provide any arguments! \nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``);
          }
          return message.lineReply(reply);
        }
        else if (command.mention && !message.mentions.users.first()){
          let reply = flashEmbed.display('RED', `${message.author.username},`, `You didn't mention a user!`)
          if (command.usage) {
            reply = flashEmbed.display('RED', `${message.author.username},`, `You didn't mention a user! \nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``)
          }
          return message.lineReply(reply);

        } else if (command.perms && !message.member.hasPermission(command.perms)) {

          return message.lineReply(
            flashEmbed.display('RED', `${message.author.username},`, `You dont have perms for this!`)
          );
        }

        const { cooldowns } = client;

        if (!cooldowns.has(command.name)) {
        	cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 1.5) * 1000;

        if (timestamps.has(message.author.id)) {
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        	if (now < expirationTime) {
        		const timeLeft = (expirationTime - now);
            const formattedTime = prettyMilliseconds(Math.round(timeLeft), {
              verbose: true,
              unitCount: 2,
            });
        		return message.lineReply(
              flashEmbed.display('RED', `${message.author.username},`, `Please wait \`${formattedTime}\` before reusing the \`${command.name}\` command.`)
            );
        	}
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        await command.execute(message, args, profileData, client, prefix);

      } catch (error) {
        console.log(error);
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
