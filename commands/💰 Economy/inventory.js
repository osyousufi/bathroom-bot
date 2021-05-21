const profileModel = require('../../models/profileSchema');
const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "inventory",
  aliases: ['inv', 'backpack', 'items', 'bp'],
  usage: '@username(optional)',
  description: "Show your inventory",
  async execute(message, args, profileData, client, prefix) {

    const user = message.mentions.users.first() || message.author
    const maxSpace = 10;

    const invEmbed = new Discord.MessageEmbed()

    try {
      await profileModel.findOne({
        userID: user.id
      }, (err, res) => {

        if (!res.inventory.length) {
          invEmbed.setTitle(`${user.username}'s inventory [${res.inventory.length}/${maxSpace}]:`)
          invEmbed.setDescription(`Nothing here 😢`)
        }

        invEmbed.setTitle(`${user.username}'s inventory [${res.inventory.length}/${maxSpace}]:`)
        for (let item of res.inventory) {
           invEmbed.addField(`${item.itemIcon} __${item.displayName}__ x ${item.itemCount}`, `Price: \`${item.itemPrice}\` rupees`)
        }


        invEmbed.setThumbnail(`${user.displayAvatarURL()}`)
        return message.channel.send(invEmbed)
      });


    } catch(e) {
      return message.lineReply(
        flashEmbed.display('YELLOW', `${message.author.username},`, `Inventory has been configured, use this command again.`)
      );
    }


  }
}
