const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require('../../models/profileSchema');
const storeItems = require('../commandUtil/storeItems');

module.exports = {
  name: "buy",
  description: "Buy an item",
  args: true,
  usage: '<item name>',
  aliases: ['purchase'],
  async execute(message, args, profileData) {

    const item = args[0]
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

    for (let product of storeItems.list) {
      if (Object.values(product).includes(item)) {
        if (profileData.rupees < product.itemPrice) {
          return message.lineReply(
            flashEmbed.display('red', `${message.author.username},`, `You do not have enough money to buy this item!`)
          );
        } else if (profileData.inventory.length >= 10) {
          return message.lineReply(
            flashEmbed.display('red', `${message.author.username},`, `Your inventory is full!`)
          );
        }

        await profileModel.findOne({
          userID: message.author.id
        }, (err, res) => {
          if(res.inventory) {
            res.inventory.push(product)
            res.save()
          } else {
            return message.lineReply(
              flashEmbed.display('#000000', `${message.author.username},`, `Inventory has been configured, use this command again.`)
            );
          }
        });

        await profileModel.findOneAndUpdate({
          userID: message.author.id
        }, { $inc: { rupees: -product.itemPrice} });

        return message.lineReply(
          flashEmbed.display('green', `${message.author.username},`, `Successfully purchased ${product.itemIcon} __${product.itemName}__ for \`${product.itemPrice}\` rupees!`)
        );
      }
    }


    return message.lineReply(
      flashEmbed.display('red', `${message.author.username},`, `This item is not in the store!`)
    );

  }
}
