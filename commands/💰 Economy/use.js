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

    const item = args[0]
      .toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

    let idx = profileData.inventory.findIndex(i => i.itemName==`${item}`);

    if(idx !== -1) {
      if (item == 'Cookie') {
        await profileData.inventory.splice(idx, 1);
        await profileData.save();
        return message.lineReply(
          flashEmbed.display('green', `${message.author.username},`, `You ate a cookie. Yummy!`)
        )
      }

      if (item == 'Gun') {
        return message.lineReply(
          flashEmbed.display(null, `${message.author.username},`, `You pull out your gun and stare at it for a bit. \nMaybe you could use this for **rob**bing someone...`)
        )
      }

    } else {
      return message.lineReply(
        flashEmbed.display('red', `${message.author.username},`, `Item not found!`)
      );
    }

  }
}
