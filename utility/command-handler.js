const Discord = require('discord.js');
const prefixModel = require('../models/prefixSchema');
const profileModel = require("../models/profileSchema");
const flashEmbed = require('./flash-embed.js');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
  async config(client, commands, cooldowns, message) {

    const messageCheck = async (prefix) => {

      //check for profile data, if none, create one
      let profileData;
      try {
        profileData = await profileModel.findOne({ userID: message.author.id });
        if(!profileData) {
          let profile = await profileModel.create({
            userID: message.author.id,
            rupees: 1000,
            bank: 0,
            inventory: []
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
      if (!command) return; //or return in message.author.channel: this command doesn't exist



      try {
        if (command.guildOnly && message.channel.type === 'dm') {

          return message.lineReplyNoMention(
            flashEmbed.display('red', `${message.author.username},`, 'I can\'t execute that command inside DMs!')
          );

        }
        else if (command.args && !args.length) {
          let reply = flashEmbed.display('red', `${message.author.username},`, `You didn't provide any arguments!`);
          if (command.usage) {
            reply = flashEmbed.display('red', `${message.author.username},`, `You didn't provide any arguments! \nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``);
          }
          return message.lineReplyNoMention(reply);
        }
        else if (command.mention && !message.mentions.users.first()){
          let reply = flashEmbed.display('red', `${message.author.username},`, `You didn't mention a user!`)
          if (command.usage) {
            reply = flashEmbed.display('red', `${message.author.username},`, `You didn't mention a user! \nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``)
          }
          return message.lineReplyNoMention(reply);

        } else if (command.perms && !message.member.hasPermission(command.perms)) {

          return message.lineReplyNoMention(
            flashEmbed.display('red', `${message.author.username},`, `You dont have perms for this!`)
          );
        }

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
        		const timeLeft = (expirationTime - now);
            const formattedTime = prettyMilliseconds(Math.round(timeLeft), {
              verbose: true,
              unitCount: 2,
            });
        		return message.lineReplyNoMention(
              flashEmbed.display('red', `${message.author.username},`, `please wait \`${formattedTime}\` before reusing the \`${command.name}\` command.`)
            );
        	}
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        
        await command.execute(message, args, profileData, client, prefix);
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
