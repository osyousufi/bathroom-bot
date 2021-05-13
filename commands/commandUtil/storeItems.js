const client = require('../../index.js');

module.exports.list = [
  {displayName: "Cookie", itemName: 'cookie', itemIcon: `${client.emojis.cache.get("835984983826366505")}`, itemPrice: 10, itemDescription: 'Tasty snack. Includes chocolate chips!', itemType: 'MARKET', itemCount: 1},
  {displayName: "Handgun", itemName: "handgun", itemIcon: `${client.emojis.cache.get("835973355625906218")}`, itemPrice: 400, itemDescription: 'Used for robberies, increase your chances of success!', itemType: 'TOOL', itemCount: 1},
  {displayName: "Fishing Rod", itemName: 'fishingrod', itemIcon: `${client.emojis.cache.get("837744148584595496")}`, itemPrice: 500, itemDescription: 'Standard fishing rod made of oyster bamboo. Unlocks the **fish** command.', itemType: 'TOOL', itemCount: 1},
  {displayName: "Hunting Rifle", itemName: 'huntingrifle', itemIcon: `${client.emojis.cache.get("842169964885442630")}`, itemPrice: 800, itemDescription: 'Standard hunting rifle made from American wood. Unlocks the **hunt** command.', itemType: 'TOOL', itemCount: 1},
]
