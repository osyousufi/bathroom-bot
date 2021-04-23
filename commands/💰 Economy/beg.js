const profileModel = require('../../models/profileSchema');
const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();

module.exports = {
  name: "beg",
  description: "Beg for money. Shameless!",
  cooldown: 25,
  async execute(message, args, profileData) {

    const successful = chance.bool({ likelihood: 73 });

    if (successful) {
      const donation = chance.integer({min: 1, max: 128});
      const response = await profileModel.findOneAndUpdate({
        userID: message.author.id
      }, { $inc: {rupees: donation} });

      if (donation > 50) {
        await message.lineReply(
          flashEmbed.display('green',`${message.author.username},`, `You begged and recieved **\`${donation}\`** rupees! \nKeep this up and you might become a millionaire!`)
        );
      } else {
        await message.lineReply(
          flashEmbed.display('green',`${message.author.username},`, `You begged and recieved **\`${donation}\`** rupees!`)
        );
      }

    } else {
      await message.lineReply(
        flashEmbed.display('red',`${message.author.username},`, `You tried begging for some meager rupees, but you ended up getting curbstomped by a rich guy in a suit!`)
      );
    }


  }
}
