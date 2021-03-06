const profileModel = require('../../models/profileSchema');
const flashEmbed = require('../../utility/flash-embed.js');


module.exports = {
  name: "daily",
  description: "Get daily rupees.",
  cooldown: 86400,
  async execute(message, args, profileData) {

    const dailyValue = 1400;

    const response = await profileModel.findOneAndUpdate({
      userID: message.author.id
    }, { $inc: {wallet: dailyValue} });

    await message.lineReply(
      flashEmbed.display('GREEN',`${message.author.username},`, `You received your daily stimulus of **\`${dailyValue}\`** rupees!`)
    );

  }
}
