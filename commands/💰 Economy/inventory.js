const profileModel = require('../../models/profileSchema');
const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "inventory",
  aliases: ['inv', 'backpack', 'items'],
  description: "show inventory",
  async execute(message, args, profileData) {

    const invEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}'s inventory:`)

    const response = await profileModel.findOne({
      userID: message.author.id
    }, (err, res) => {
      if(res.inventory) {
        // res.inventory.push('test item')
        // res.save()

        if (!res.inventory.length) {
          return message.channel.send(
            flashEmbed.display('green',`${message.author.username}'s inventory:`, `Nothing here 😢`)
          )
        } else {
          for (let item of res.inventory) {
            invEmbed.addField(`__${item.itemName}__`, `Price: \`${item.price}\` rupees`)
          }
          return message.channel.send(invEmbed)
        }
        console.log(res.inventory)
      } else {
        return message.lineReplyNoMention(
          flashEmbed.display('#000000', `${message.author.username},`, `Inventory has been configured, use this command again.`)
        );
      }
    });

  }
}
