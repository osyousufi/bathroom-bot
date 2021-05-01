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

    const item = args[0]
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');




    // let total = 0;
    // for (let product of profileData.inventory) {
    //   if (Object.values(product).includes(item)) {
    //     total+=1;
    //
    //     // await profileModel.findOne({
    //     //   userID: message.author.id
    //     // }, (err, res) => {
    //     //   if(res.inventory) {
    //     //     res.inventory.pop(product)
    //     //     res.save()
    //     //   } else {
    //     //     return message.lineReplyNoMention(
    //     //       flashEmbed.display('#000000', `${message.author.username},`, `Inventory has been configured, use this command again.`)
    //     //     );
    //     //   }
    //     // });
    //     //
    //     // await profileModel.findOneAndUpdate({
    //     //   userID: message.author.id
    //     // }, { $inc: { wallet: product.itemPrice} });
    //     //
    //     // return message.lineReplyNoMention(
    //     //   flashEmbed.display('green', `${message.author.username},`, `Successfully sold __${product.itemName}__ for \`${product.itemPrice}\` rupees!`)
    //     // );
    //   }
    // }
    let amount = args[1]

    let total = 0
    Object.values(profileData.inventory).forEach(i => i.itemName == item ? total+=1 : null)

    if (total == 0) {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `This item is not in your inventory!`)
      )
    }

     if (!amount) {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `Please enter an amount!`)
      )
    } else if(amount.toLowerCase() == 'all') {
      amount = total
    } else if (amount % 1 !== 0 || amount < 1) {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `Please enter a valid amount!`)
      )
    } else if (amount > total) {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `You do not have that many of the specified item!`)
      )
    }



    console.log(amount)

  }
}
