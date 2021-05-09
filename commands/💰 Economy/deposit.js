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

    try {
      if (amount == 'all') {
        if (profileData.wallet <= 0) {
          return message.lineReplyNoMention(
            flashEmbed.display('#FF0000', `${message.author.username},`, `No money in your wallet!`)
          )
        }
        await profileModel.findOneAndUpdate({
          userID: message.author.id
        }, { $inc: { wallet: -profileData.wallet, bank: +profileData.wallet }});

        return message.channel.send(
          flashEmbed.display('#00FF00', `${message.author.username},`, `Desposited **\`${Number(profileData.wallet).toString()}\`** rupees from your wallet!`)
        )
      }

      if(amount % 1 !== 0 || amount <= 0) {
        return message.lineReplyNoMention(
          flashEmbed.display('#FF0000', `${message.author.username},`, `Amount must be a positive whole number!`)
        )
      } else if (amount > profileData.wallet) {
        return message.lineReplyNoMention(
          flashEmbed.display('#FF0000', `${message.author.username},`, `You do not have that much money!`)
        )
      }

      await profileModel.findOneAndUpdate({
        userID: message.author.id
      }, { $inc: { wallet: -amount, bank: amount }}
    )

      return message.lineReplyNoMention(
        flashEmbed.display('#00FF00', `${message.author.username},`, `Deposited **\`${Number(amount).toString()}\`** rupees into your bank!`)
      )
    } catch (e) {
      console.log(e)
    }

  }
}
