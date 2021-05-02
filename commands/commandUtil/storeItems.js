const client = require('../../index.js');

module.exports.list = [
  {displayName: "Cookie", itemName: 'cookie', itemIcon: `${client.emojis.cache.get("835984983826366505")}`, itemPrice: 10, itemDescription: 'Tasty snack. Includes chocolate chips!', itemType: 'CONSUMABLE', itemCount: 1},
  {displayName: "Handgun", itemName: "handgun", itemIcon: `${client.emojis.cache.get("835973355625906218")}`, itemPrice: 750, itemDescription: 'Used for robberies, increase your chances of success!', itemType: 'TOOL', itemCount: 1},
  {displayName: "Fishing Rod", itemName: 'fishingrod', itemIcon: `${client.emojis.cache.get("837744148584595496")}`, itemPrice: 2500, itemDescription: 'Used for fishing.', itemType: 'TOOL', itemCount: 1}
]
