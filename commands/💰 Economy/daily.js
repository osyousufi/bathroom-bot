const Discord = require('discord.js');
const profileModel = require('../../models/profileSchema');
const flashEmbed = require('../../utility/flash-embed.js');


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

    await message.lineReplyNoMention(
      flashEmbed.display('#00FF00',`${message.author.username},`, `you received your daily stimulus of **\`${dailyValue}\`** rupees!`)
    );

  }
}
