const profileModel = require('../../models/profileSchema');
const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();

module.exports = {
  name: "work",
  description: "Work for money. WIP",
  cooldown: 1800,
  async execute(message, args, profileData) {

    // const successful = chance.bool({ likelihood: 73 });
    const income = chance.integer({min: 250, max: 1000})

    await profileModel.findOneAndUpdate({
      userID: message.author.id
    }, { $inc: {wallet: income} });

    return message.lineReply(
      flashEmbed.display('GREEN', `${message.author.username},`, `You worked and recieved \`${income}\` rupees!`)
    )


  }
}
