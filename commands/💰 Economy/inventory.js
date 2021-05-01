const profileModel = require('../../models/profileSchema');
const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "inventory",
  aliases: ['inv', 'backpack', 'items', 'bp'],
  description: "Show your inventory",
  async execute(message, args, profileData, client, prefix) {

    const invEmbed = new Discord.MessageEmbed()
      .setFooter(`Tip: ${prefix}use <item name> to use an item!`)

    const maxSpace = 10;
    const response = await profileModel.findOne({
      userID: message.author.id
    }, (err, res) => {
      if(res.inventory) {

        if (!res.inventory.length) {
          return message.channel.send(
            flashEmbed.display('GREEN',`${message.author.username}'s inventory [${res.inventory.length}/${maxSpace}]:`, `Nothing here 😢`)
          )
        } else {
          invEmbed.setTitle(`${message.author.username}'s inventory [${res.inventory.length}/${maxSpace}]:`)




          // const getCount = (i) => {
          //   count = 0;
          //   for (let item of res.inventory) {
          //     if(item.itemName == i.itemName) {
          //       count+=1
          //     }
          //
          //   }
          //   return count;
          // }

          // const key = 'itemName';
          //
          //
          //
          // const arrayUniqueByKey = [...new Map(res.inventory.map(i =>[i[key], i])).values()];
          //
          //
          // for (let i of res.inventory) {
          //   console.log(i)
          // }
          for (let item of res.inventory) {


            // let itemCount = res.inventory.filter((v) => {
            //   return v ==
            // })
             invEmbed.addField(`${item.itemIcon} __${item.itemName}__`, `Price: \`${item.itemPrice}\` rupees \nDescription: ${item.itemDescription}`)
            // if(Object.keys(itemData).indexOf(`${item.itemName}`) !== -1) {
            //   itemData[`${item.itemName}`]['itemCount'] = itemData[`${item.itemName}`]['itemCount'] + 1
            //   for (let i = 0; i < Object.keys(itemData).length; i++) {
            //     invEmbed.fields[i] = {name: `${itemData[Object.keys(itemData)[i]].itemIcon} __${itemData[Object.keys(itemData)[i]].itemName}__ x ${itemData[Object.keys(itemData)[i]]['itemCount']}`, value: `Price: \`${itemData[Object.keys(itemData)[i]].itemPrice}\` rupees \nDescription: ${itemData[Object.keys(itemData)[i]].itemDescription}`}
            //   }
            //
            // } else {
            //   itemData[`${item.itemName}`] = {itemCount: 1, itemName: item.itemName, itemIcon: item.itemIcon, itemPrice: item.itemPrice, itemDescription: item.itemDescription}
            //   invEmbed.addField(`${item.itemIcon} __${item.itemName}__ x ${itemData[`${item.itemName}`]['itemCount']}`, `Price: \`${item.itemPrice}\` rupees \nDescription: ${item.itemDescription}`)
            // }


          }


          return message.channel.send(invEmbed)
        }
      } else {
        return message.lineReply(
          flashEmbed.display('#000000', `${message.author.username},`, `Inventory has been configured, use this command again.`)
        );
      }
    });

  }
}
