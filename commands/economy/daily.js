const Discord = require('discord.js');
const profileModel = require('../../models/profileSchema');

module.exports = {
  name: "daily",
  description: "Get daily rupees.",
  cooldown: 86400,
  async execute(message, args, profileData) {

    //for random logic:
    // const randomRange = 100;
    // const randomNumber = Math.floor(Math.random() * randomRange) + 1;

    const dailyValue = 1400;

    const response = await profileModel.findOneAndUpdate({
      userID: message.author.id
    }, { $inc: {rupees: dailyValue} });

    const flashEmbed = new Discord.MessageEmbed()
      .setColor('#00FF00');

    flashEmbed.setTitle(`${message.author.username},`);
    flashEmbed.setDescription(`you received your daily stimulus of **\`${dailyValue}\`** rupees!`);
    return message.channel.send(flashEmbed);
  }
}
