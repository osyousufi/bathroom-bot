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

    try {
      if (amount == 'all') {
        if (profileData.bank == 0) {
          return message.lineReply(
            flashEmbed.display('#FF0000', `${message.author.username},`, `No money in your bank! broke mf!! LOL`)
          )
        }
        await profileModel.findOneAndUpdate({
          userID: message.author.id
        }, { $inc: { rupees: +profileData.bank, bank: -profileData.bank }});

        return message.channel.send(
          flashEmbed.display('#00FF00', `${message.author.username},`, `Withdrew **\`${Number(profileData.bank).toString()}\`** rupees from your bank!`)
        )
      }

      if(amount % 1 !== 0 || amount <= 0) {
        return message.lineReply(
          flashEmbed.display('#FF0000', `${message.author.username},`, `Amount must be a positive whole number!`)
        )
      } else if (amount > profileData.bank) {
        return message.lineReply(
          flashEmbed.display('#FF0000', `${message.author.username},`, `You do not have that much money! broke mf lmAo`)
        )
      }

      await profileModel.findOneAndUpdate({
        userID: message.author.id
      }, { $inc: { rupees: +amount, bank: -amount }});


      return message.lineReply(
        flashEmbed.display('#00FF00', `${message.author.username},`, `Withdrew **\`${Number(amount).toString()}\`** rupees from your bank!`)
      )
    } catch (e) {
      console.log(e)
    }

  }
}
