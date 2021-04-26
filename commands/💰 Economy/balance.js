const Discord = require('discord.js');
const profileModel = require("../../models/profileSchema");
const flashEmbed = require('../../utility/flash-embed.js');
const profileHandler = require('../../utility/profile-handler.js');

module.exports = {
  name: 'balance',
  description: 'List balance of user',
  usage: '<@username>',
  aliases: ['bal', 'money', 'cash', 'wallet', 'bank'],
  async execute(message, args, profileData) {

    const taggedUser = message.mentions.users.first();
    if (taggedUser) {

      let taggedProfileData;
      try {
        taggedProfileData = await profileModel.findOne({ userID: taggedUser.id });
        if(!taggedProfileData) {
          profileHandler.set(profileModel, taggedUser);
        }
      } catch (err) {
         console.log(err);
      }

      try {
        await message.lineReply(
          flashEmbed.display('green', `${taggedUser.username}'s balance:`, `Wallet: **\`${taggedProfileData.rupees}\`** rupees \n\nBank: **\`${taggedProfileData.bank}\`** rupees`)
        );
      } catch (err) {
          await message.lineReply(
            flashEmbed.display('yellow', `${message.author.username},`, `Balance has been configured, use this command again.`)
          );
      }


    } else {

      try {
        await message.channel.send(
          flashEmbed.display('green', `${message.author.username}'s balance:`, `Wallet: **\`${profileData.wallet}\`** rupees \n\nBank: **\`${profileData.bank}\`** rupees`)
        );
      } catch (err) {
        await message.lineReply(
          flashEmbed.display('yellow', `${message.author.username},`, `Balance has been configured, use this command again.`)
        );
      }

    }


  }
}
