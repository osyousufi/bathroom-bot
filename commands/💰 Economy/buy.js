const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require('../../models/profileSchema');
const storeItems = require('../commandUtil/storeItems');

module.exports = {
  name: "buy",
  description: "Buy an item",
  args: true,
  usage: '<item name> amount(optional)',
  aliases: ['purchase'],
  async execute(message, args, profileData, client, prefix) {

    let productName = args[0].toLowerCase()
    let amount = args[1];
    let totalPrice;

    const inStock = await storeItems.list.some(i => i.itemName == productName)

    if (inStock) {
      if (!amount) {
        amount = 1
      } else if (amount % 1 !== 0 || amount < 1) {
        return message.lineReply(
          flashEmbed.display('RED', `${message.author.username},`, `Please enter a valid amount!`)
        )
      }

      let product = await storeItems.list.find(i => i.itemName == productName)
      totalPrice = product.itemPrice * amount

      if (totalPrice > profileData.wallet) {
        return message.lineReply(
          flashEmbed.display('RED', `${message.author.username},`, `You cannot afford that!`)
        )
      }


      await profileModel.findOne({
        userID: message.author.id
      }, async (err, res) => {

        const inInventory = await res.inventory.find(i => i.itemName == product.itemName)

        const idx = res.inventory.indexOf(inInventory)

        if (!inInventory) {
          product.itemCount = parseInt(amount)
          res.inventory.push(product)
          await res.save()
        } else {
          inInventory.itemCount = parseInt(inInventory.itemCount) + parseInt(amount)
          res.inventory.set(idx, inInventory)
          await res.save()
        }
        return message.lineReply(
          flashEmbed.display('GREEN', `${message.author.username},`, `Bought **x${amount}** ${product.itemIcon} __${product.displayName}__ for \`${totalPrice}\` rupees`)
        )
      });

      await profileModel.findOneAndUpdate({
        userID: message.author.id
      }, { $inc: {wallet: -totalPrice} })


    } else {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `Item not found! \n Try removing any spaces!`)
      )
    }

  }
}
