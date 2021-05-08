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

      if (item == 'handgun') {
        return message.lineReply(
          flashEmbed.display('BLACK', `${message.author.username},`, `You pull out your gun and stare at it for a bit. \n Maybe you could use this to **rob** someone...`)
        )
      }

      if (item == 'fishingrod') {
        return message.lineReply(
          flashEmbed.display('AQUA', `${message.author.username},`, `You pull out your fishing rod and stare at it for a bit. \n Maybe you could use this to **fish** in the sea...`)
        )
      }

    } else {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `Item not found! \n Try removing spaces.`)
      );
    }

  }
}
