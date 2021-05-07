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

    const inStock = await profileData.inventory.some(i => i.itemName == productName);

    if (inStock) {

      let product = await profileData.inventory.find(i => i.itemName == productName)



      if (!amount) {
        amount = 1
      } else if (amount.toLowerCase() == 'all') {
        amount = product.itemCount
      }
      else if (amount % 1 !== 0 || amount < 1 || amount > product.itemCount) {
        return message.lineReply(
          flashEmbed.display('RED', `${message.author.username},`, `Please enter a valid amount!`)
        )
      }

      if (product.itemType == 'MARKET') {
        totalPrice = amount * product.itemPrice
      } else {
        totalPrice = amount * (product.itemPrice * 0.5)
      }

      await profileModel.findOne({
        userID: message.author.id
      }, async (err, res) => {

        const inInventory = await res.inventory.find(i => i.itemName == product.itemName)
        const idx = res.inventory.indexOf(inInventory)

        inInventory.itemCount = parseInt(inInventory.itemCount) - parseInt(amount)
        res.inventory.set(idx, inInventory)
        await res.save()

        if (inInventory.itemCount <= 0) {
          res.inventory.splice(idx, 1)
          await res.save()
        }

        return message .lineReply(
          flashEmbed.display('GREEN', `${message.author.username},`, `Sold **x${amount}** ${inInventory.itemIcon} __${inInventory.displayName}__ for \`${totalPrice}\` rupees`)
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
