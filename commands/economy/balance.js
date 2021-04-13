const Discord = require('discord.js');
const profileModel = require("../../models/profileSchema");

module.exports = {
  name: 'balance',
  description: 'List balance of user',
  usage: '<@username>',
  aliases: ['bal'],
  async execute(message, args, profileData) {

    const flashEmbed = new Discord.MessageEmbed()
			.setColor('#00FF00');

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
        flashEmbed.setTitle(`${taggedUser.username}'s balance is:`);
        flashEmbed.setDescription(`***${taggedProfileData.rupees}*** rupees`);
        await message.channel.send(flashEmbed);
      } catch (err) {
          flashEmbed.setColor('#000000');
          flashEmbed.setTitle(`${message.author.username}`,);
          flashEmbed.setDescription(`Balance has been configured, use this command again.`)
          await message.channel.send(flashEmbed);
      }


    } else {

      try {
        flashEmbed.setTitle(`${message.author.username},`);
        flashEmbed.setDescription(`Your current balance is: ***${profileData.rupees}*** rupees, your bank balance is: ***${profileData.bank}*** rupees`)
        await message.channel.send(flashEmbed);
      } catch (err) {
        flashEmbed.setColor('#000000');
        flashEmbed.setTitle(`${message.author.username}`,);
        flashEmbed.setDescription(`Balance has been configured, use this command again.`)
        await message.channel.send(flashEmbed);
      }

    }


  }
}
