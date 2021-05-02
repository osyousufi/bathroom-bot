const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require('../../models/profileSchema');
const storeItems = require('../commandUtil/storeItems');

module.exports = {
  name: "sell",
  description: "Sell an item",
  args: true,
  usage: '<item name> <amount>',
  async execute(message, args, profileData, client, prefix) {

    let productName = args[0].toLowerCase()
    let amount = args[1];
    let totalPrice;

    const inStock = profileData.inventory.find(i => i.itemName == productName)

    if (inStock) {

      if (!amount) {
        amount = 1
      } else if (amount.toLowerCase() == 'all') {
        amount = inStock.itemCount
      }
      else if (amount % 1 !== 0 || amount < 1 || amount > inStock.itemCount) {
        return message.lineReply(
          flashEmbed.display('RED', `${message.author.username},`, `Please enter a valid amount!`)
        )
      }

      if (inStock.itemType == 'CONSUMABLE') {
        totalPrice = amount * inStock.itemPrice
      } else {
        totalPrice = amount * (inStock.itemPrice * 0.5)
      }

      await profileModel.findOne({
        userID: message.author.id
      }, (err, res) => {


        res.inventory.pop(inStock)
        inStock.itemCount = parseInt(inStock.itemCount) - parseInt(amount)
        if (inStock.itemCount == 0) {
          res.save()
        } else {
          res.inventory.push(inStock)
          res.save()
        }

        return message.lineReply(
          flashEmbed.display('GREEN', `${message.author.username},`, `Sold **x${amount}** ${inStock.itemIcon} __${inStock.displayName}__ for \`${totalPrice}\` rupees`)
        )
      });

      await profileModel.findOneAndUpdate({
        userID: message.author.id
      }, { $inc: {wallet: +totalPrice} });

    } else {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `Item not found! \n Try removing any spaces!`)
      )
    }


  }
}
