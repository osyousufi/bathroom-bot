const Discord = require('discord.js');
const storeItems = require('../secret/storeItems');

module.exports = {
  name: "store",
  description: "View the store!",
  aliases: ['shop', 'merchant'],
  async execute(message, args) {


    const storeEmbed = new Discord.MessageEmbed()
      .setTitle('Store')

    for (let item of storeItems.list) {
      storeEmbed.addField(`__${item.itemName}__`, `Price: \`${item.itemPrice}\` rupees \nDescription: ${item.itemDescription}`);
    }

    message.channel.send(storeEmbed);
  }
}
