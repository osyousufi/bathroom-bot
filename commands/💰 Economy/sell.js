const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require('../../models/profileSchema');
const storeItems = require('../commandUtil/storeItems');

module.exports = {
  name: "sell",
  description: "Sell an item",
  args: true,
  cooldown: 5,
  usage: '<item name> <amount>',
  async execute(message, args, profileData, client, prefix) {

    let itemData = {}

    await profileModel.findOne({
      userID: message.author.id
    }, (err, res) => {
      for (let i of res.inventory) {
        if(Object.keys(itemData).indexOf(`${i.itemName}`) !== -1) {
          itemData[`${i.itemName}`]['itemCount'] = itemData[`${i.itemName}`]['itemCount'] + 1
        } else {
          itemData[`${i.itemName}`] = {itemCount: 1, itemName: i.itemName, itemIcon: i.itemIcon, itemPrice: i.itemPrice, itemDescription: i.itemDescription}
        }
      }
    })


    let item = args[0];
    let amount = args[1];

    if (!item) {
      return message.lineReply(
        flashEmbed.display('#FF0000', `${message.author.username},`, `Please enter an item! \nThe proper usage would be: \`${prefix}sell <amount> <item name>\``)
      )
    }


    item = item.charAt(0).toUpperCase() + item.slice(1)

    console.log(itemData[item])
    if (!amount) {
      amount = 1
    } else if(amount.toLowerCase() == 'all') {
      amount = itemData[item].itemCount
    } else if(amount % 1 !== 0 || amount < 1) {
      return message.lineReply(
        flashEmbed.display('#FF0000', `${message.author.username},`, `Please enter a valid amount! \nThe proper usage would be: \`${prefix}sell <amount> <item name>\``)
      )
    }

    if (Object.keys(itemData).indexOf(item) == -1) {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `This item is not in your inventory!`)
      );
    } else if (amount > itemData[item].itemCount) {
      return message.lineReply(
        flashEmbed.display('#FF0000', `${message.author.username},`, `You do not have that much of that item.`)
      )
    }




    let sellPrice = 0;

    for (let product of profileData.inventory) {

      if(item == product.itemName) {

        let counter = amount;
        while(counter > 0) {
          counter = counter - 1;
          if (product.itemType == 'CONSUMABLE') {
            sellPrice += itemData[item].itemPrice;
          } else {
            sellPrice += itemData[item].itemPrice * 0.5;
          }

          console.log(sellPrice)
          await profileModel.findOneAndUpdate({userID: message.author.id}, {$inc: {wallet: +sellPrice}, $pull: {inventory: product} })

        }

        return message.lineReply(
          flashEmbed.display('GREEN', `${message.author.username},`, `Successfully sold x ${amount} ${itemData[item].itemIcon} __${itemData[item].itemName}__ for \`${sellPrice}\` rupees!`)
        );

      }

    }


  }
}
