const Discord = require('discord.js');
const profileModel = require("../../models/profileSchema");
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: 'balance',
  description: 'List balance of user',
  usage: '<@username>',
  aliases: ['bal'],
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
            bank: 0
          });
          profile.save();
        }
      } catch (err) {
         console.log(err);
      }

      try {
        await message.channel.send(
          flashEmbed.display('#00FF00', `${taggedUser.username}'s balance is:`, `**\`${taggedProfileData.rupees}\`** rupees. Their bank balance is: **\`${taggedProfileData.bank}\`** rupees`)
        );
      } catch (err) {
          await message.channel.send(
            flashEmbed.display('#000000', `${message.author.username},`, `Balance has been configured, use this command again.`)
          );
      }


    } else {

      try {
        await message.channel.send(
          flashEmbed.display('#00FF00', `${message.author.username},`, `Your current balance is: **\`${profileData.rupees}\`** rupees, your bank balance is: **\`${profileData.bank}\`** rupees`)
        );
      } catch (err) {
        await message.channel.send(
          flashEmbed.display('#000000', `${message.author.username},`, `Balance has been configured, use this command again.`)
        );
      }

    }


  }
}
