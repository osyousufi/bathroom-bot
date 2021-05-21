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
          flashEmbed.display('DARK_ORANGE', `${message.author.username},`, `You ate a(n)  ${validItem.itemIcon} __${validItem.displayName}__. Yum!`)
        )
      }

      if (validItem.itemType == 'MARKET') {
        return message.lineReply(
          flashEmbed.display('GREEN', `${message.author.username},`, `This looks like something merchants would buy. \n Maybe you could **sell** this?`)
        )
      }

      if (validItem.itemType == 'TOOL') {
        return message.lineReply(
          flashEmbed.display('ORANGE', `${message.author.username},`, `You can't directly use this item. But maybe there's another way to use it...`)
        )
      }


    } else {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `Item not found! \n Try removing spaces.`)
      );
    }

  }
}
