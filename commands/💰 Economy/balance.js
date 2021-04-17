const Discord = require('discord.js');
const profileModel = require("../../models/profileSchema");
const flashEmbed = require('../../utility/flash-embed.js');

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
          let profile = await profileModel.create({
            userID: taggedUser.id,
            rupees: 1000,
            bank: 0,
            inventory: []
          });
          profile.save();
        }
      } catch (err) {
         console.log(err);
      }

      try {
        await message.lineReplyNoMention(
          flashEmbed.display('#00FF00', `${taggedUser.username}'s balance:`, `Wallet: **\`${taggedProfileData.rupees}\`** rupees \n\nBank: **\`${taggedProfileData.bank}\`** rupees`)
        );
      } catch (err) {
          await message.lineReplyNoMention(
            flashEmbed.display('#000000', `${message.author.username},`, `Balance has been configured, use this command again.`)
          );
      }


    } else {

      try {
        await message.channel.send(
          flashEmbed.display('#00FF00', `${message.author.username}'s balance:`, `Wallet: **\`${profileData.rupees}\`** rupees \n\nBank: **\`${profileData.bank}\`** rupees`)
        );
      } catch (err) {
        await message.lineReplyNoMention(
          flashEmbed.display('#000000', `${message.author.username},`, `Balance has been configured, use this command again.`)
        );
      }

    }


  }
}
