const Discord = require('discord.js');
const profileModel = require("../../models/profileSchema");
const flashEmbed = require('../../utility/flash-embed.js');
const profileHandler = require('../../utility/profile-handler.js');

module.exports = {
  name: 'balance',
  description: 'List balance of user',
  usage: '@username(optional)',
  aliases: ['bal', 'money', 'cash', 'wallet', 'bank'],
  async execute(message, args, profileData) {

    const taggedUser = message.mentions.users.first();
    if (taggedUser) {

      let taggedProfileData = await profileModel.findOne({ userID: taggedUser.id });
      if(!taggedProfileData) {
        profileHandler.set(profileModel, taggedUser);
      }


      try {
        return message.lineReply(
          flashEmbed.display('GREEN', `${taggedUser.username}'s balance:`, `Wallet: **\`${taggedProfileData.wallet}\`** rupees \n\nBank: **\`${taggedProfileData.bank}\`** rupees`)
        );
      } catch (err) {
          return message.lineReply(
            flashEmbed.display('YELLOW', `${message.author.username},`, `Balance has been configured, use this command again.`)
          );
      }

    }

    try {
      return message.lineReply(
        flashEmbed.display('GREEN', `${message.author.username}'s balance:`, `Wallet: **\`${profileData.wallet}\`** rupees \n\nBank: **\`${profileData.bank}\`** rupees`)
      );
    } catch (err) {
      return message.lineReply(
        flashEmbed.display('YELLOW', `${message.author.username},`, `Balance has been configured, use this command again.`)
      );
    }




  }
}
