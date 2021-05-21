const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require('../../models/profileSchema');
const storeItems = require('../commandUtil/storeItems');

module.exports = {
  name: "inspect",
  description: "Inspect an item",
  args: true,
  aliases: ['insp', 'info'],
  usage: '<item name>',
  async execute(message, args, profileData) {

    let item = args[0].toLowerCase()
    let validItem = profileData.inventory.find(i => i.itemName==`${item}`);

    const inspectEmbed = new Discord.MessageEmbed()

    if(validItem) {

      inspectEmbed.addField(`${validItem.itemIcon} __${validItem.displayName}__`, `*Price:* \`${validItem.itemPrice}\` rupees \n *Description:* ${validItem.itemDescription} \n *ID:* \`${validItem.itemName}\` \n *Type:* ${validItem.itemType}`)
      return message.channel.send(inspectEmbed)

    } else {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `Item not found! \n Try removing spaces.`)
      );
    }

  }
}
