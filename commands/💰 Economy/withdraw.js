const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require("../../models/profileSchema");

module.exports = {
  name: "withdraw",
  description: "Withdraw money from your bank to your wallet",
  aliases: ['wd', 'withd', 'wdraw'],
  args: true,
  usage: '<amount>',
  async execute(message, args, profileData) {

    const amount = args[0];

    if(amount % 1 != 0 || amount <= 0) return message.channel.send('withdrawal amount must be positive whole number')

    try {
      if (amount > profileData.bank) return message.channel.send('you dont have that much lol')
      await profileModel.findOneAndUpdate({
        userID: message.author.id
      }, { $inc: { rupees: +amount, bank: -amount }}
    )

      return message.channel.send(`you withdrew ${amount} of coins into your bank!`)
    } catch (e) {
      console.log(e)
    }

  }
}
