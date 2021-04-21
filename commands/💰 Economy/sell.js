const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require('../../models/profileSchema');
const storeItems = require('../secret/storeItems');

module.exports = {
  name: "sell",
  description: "Sell an item",
  args: true,
  usage: '<item name>',
  async execute(message, args, profileData) {

    const item = args[0]
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

    for (let product of profileData.inventory) {
      if (Object.values(product).includes(item)) {

        await profileModel.findOne({
          userID: message.author.id
        }, (err, res) => {
          if(res.inventory) {
            res.inventory.pop(product)
            res.save()
          } else {
            return message.lineReplyNoMention(
              flashEmbed.display('#000000', `${message.author.username},`, `Inventory has been configured, use this command again.`)
            );
          }
        });

        await profileModel.findOneAndUpdate({
          userID: message.author.id
        }, { $inc: { rupees: product.price} });

        return message.lineReplyNoMention(
          flashEmbed.display('green', `${message.author.username},`, `Successfully sold __${product.itemName}__ for \`${product.price}\` rupees!`)
        );
      }
    }


    return message.lineReplyNoMention(
      flashEmbed.display('red', `${message.author.username},`, `This item is not in your inventory!`)
    );




  }
}
