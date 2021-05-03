const profileModel = require('../../models/profileSchema');
const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "inventory",
  aliases: ['inv', 'backpack', 'items', 'bp'],
  usage: '@username(optional)',
  description: "Show your inventory",
  async execute(message, args, profileData, client, prefix) {

    const invEmbed = new Discord.MessageEmbed()
      .setColor('BLUE')
      .setFooter(`Tip: ${prefix}use <item name> to use an item`)

    const taggedUser = message.mentions.users.first();
    const maxSpace = 10;

    if (taggedUser) {

      let taggedProfileData = await profileModel.findOne({ userID: taggedUser.id });
      if(!taggedProfileData) {
        profileHandler.set(profileModel, taggedUser);
      }

      try {
        await profileModel.findOne({
          userID: taggedUser.id
        }, (err, res) => {

          if (!res.inventory.length) {
            invEmbed
              .setTitle(`${taggedUser.username}'s inventory [${res.inventory.length}/${maxSpace}]:`)
              .setDescription(`Nothing here 😢`)
          }

          invEmbed.setTitle(`${taggedUser.username}'s inventory [${res.inventory.length}/${maxSpace}]:`)
          for (let item of res.inventory) {
             invEmbed.addField(`${item.itemIcon} __${item.displayName}__ x ${item.itemCount}`, `Price: \`${item.itemPrice}\` rupees \nDescription: ${item.itemDescription}`)
          }
        });
        return message.channel.send(invEmbed)

      } catch (e) {
        return message.lineReply(
          flashEmbed.display('YELLOW', `${message.author.username},`, `Inventory has been configured, use this command again.`)
        );
      }

    }

    try {
      await profileModel.findOne({
        userID: message.author.id
      }, (err, res) => {
        if (!res.inventory.length) {
          invEmbed
            .setTitle(`${taggedUser.username}'s inventory [${res.inventory.length}/${maxSpace}]:`)
            .setDescription(`Nothing here 😢`)
        }
        invEmbed.setTitle(`${message.author.username}'s inventory [${res.inventory.length}/${maxSpace}]:`)
        for (let item of res.inventory) {
           invEmbed.addField(`${item.itemIcon} __${item.displayName}__ x ${item.itemCount}`, `Price: \`${item.itemPrice}\` rupees \nDescription: ${item.itemDescription}`)
        }

        return message.channel.send(invEmbed)
      });


    } catch(e) {
      return message.lineReply(
        flashEmbed.display('YELLOW', `${message.author.username},`, `Inventory has been configured, use this command again.`)
      );
    }


  }
}
