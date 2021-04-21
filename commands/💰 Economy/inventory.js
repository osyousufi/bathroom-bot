const profileModel = require('../../models/profileSchema');
const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "inventory",
  aliases: ['inv', 'backpack', 'items'],
  description: "show inventory",
  async execute(message, args, profileData) {

    const invEmbed = new Discord.MessageEmbed()

    const maxSpace = 10;
    const response = await profileModel.findOne({
      userID: message.author.id
    }, (err, res) => {
      if(res.inventory) {
        // res.inventory.push('test item')
        // res.save()

        if (!res.inventory.length) {
          return message.channel.send(
            flashEmbed.display('green',`${message.author.username}'s inventory [${res.inventory.length}/${maxSpace}]:`, `Nothing here 😢`)
          )
        } else {
          invEmbed.setTitle(`${message.author.username}'s inventory [${res.inventory.length}/${maxSpace}]:`)
          for (let item of res.inventory) {
            invEmbed.addField(`__${item.itemName}__`, `Price: \`${item.itemPrice}\` rupees \nDescription: ${item.itemDescription}`)
          }
          return message.channel.send(invEmbed)
        }
      } else {
        return message.lineReplyNoMention(
          flashEmbed.display('#000000', `${message.author.username},`, `Inventory has been configured, use this command again.`)
        );
      }
    });

  }
}
