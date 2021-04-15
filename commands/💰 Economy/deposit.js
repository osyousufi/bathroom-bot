const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require("../../models/profileSchema");

module.exports = {
  name: "deposit",
  description: "Deposit money from your wallet to your bank",
  aliases: ['dp', 'dep', 'depo'],
  args: true,
  usage: '<amount>',
  async execute(message, args, profileData) {

    const amount = args[0];

    if(amount % 1 != 0 || amount <= 0) return message.channel.send('deposit must be positive whole number')

    try {
      if (amount > profileData.rupees) return message.channel.send('you dont have that much lol')
      await profileModel.findOneAndUpdate({
        userID: message.author.id
      }, { $inc: { rupees: -amount, bank: amount }}
    )

      return message.channel.send(`you deposited ${amount} of coins into your bank!`)
    } catch (e) {
      console.log(e)
    }

  }
}
