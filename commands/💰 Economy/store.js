const Discord = require('discord.js');
const storeItems = require('../commandUtil/storeItems');

module.exports = {
  name: "store",
  description: "View the store!",
  aliases: ['shop', 'merchant'],
  async execute(message, args, profileData, client, prefix) {
    const storeEmbed = new Discord.MessageEmbed()
      .setTitle('Store')


    for (let item of storeItems.list) {
      storeEmbed.addField(`${item.itemIcon} __${item.displayName}__`, `Price: \`${item.itemPrice}\` rupees \nDescription: ${item.itemDescription}`);
    }

    return message.channel.send(storeEmbed);
  }
}
