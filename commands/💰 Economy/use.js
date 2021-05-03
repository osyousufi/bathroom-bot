const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require('../../models/profileSchema');
const storeItems = require('../commandUtil/storeItems');

module.exports = {
  name: "use",
  description: "Use an item",
  args: true,
  usage: '<item name>',
  async execute(message, args, profileData) {

    let item = args[0].toLowerCase()
    let validItem = profileData.inventory.find(i => i.itemName==`${item}`);

    if(validItem) {
      if (validItem.itemType == 'CONSUMABLE') {
        return message.lineReply(
          flashEmbed.display('RED', `${message.author.username},`, `You can't **use** this item. Did you mean to **eat** it instead?`)
        )
      }

      if (item == 'handgun') {
        return message.lineReply(
          flashEmbed.display('BLACK', `${message.author.username},`, `You pull out your gun and stare at it for a bit. \n Maybe you could use this for **rob**bing someone...`)
        )
      }

      if (item == 'fishingrod') {
        return message.lineReply(
          flashEmbed.display('AQUA', `${message.author.username},`, `You pull out your fishing rod and stare at it for a bit. \n Maybe you could use this for **fish**ing...`)
        )
      }

    } else {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `Item not found! \n Try removing spaces.`)
      );
    }

  }
}
