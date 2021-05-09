const client = require('../../index.js');

module.exports.list = [
  {displayName: "Cookie", itemName: 'cookie', itemIcon: `${client.emojis.cache.get("835984983826366505")}`, itemPrice: 10, itemDescription: 'Tasty snack. Includes chocolate chips!', itemType: 'CONSUMABLE', itemCount: 1},
  {displayName: "Handgun", itemName: "handgun", itemIcon: `${client.emojis.cache.get("835973355625906218")}`, itemPrice: 550, itemDescription: 'Used for robberies, increase your chances of success!', itemType: 'TOOL', itemCount: 1},
  {displayName: "Old Rod", itemName: 'oldrod', itemIcon: `${client.emojis.cache.get("840829807868641284")}`, itemPrice: 50, itemDescription: 'Terrible fishing rod made of cracked sticks and dirty string.', itemType: 'TOOL', itemCount: 1},
  {displayName: "Good Rod", itemName: 'goodrod', itemIcon: `${client.emojis.cache.get("840830142388371457")}`, itemPrice: 500, itemDescription: 'Standard fishing rod made from steel.', itemType: 'TOOL', itemCount: 1},
  {displayName: "Ancient Rod", itemName: 'ancientrod', itemIcon: `${client.emojis.cache.get("840829995379064842")}`, itemPrice: 4500, itemDescription: 'Legendary fishing rod made of oyster bamboo.', itemType: 'TOOL', itemCount: 1},
]
