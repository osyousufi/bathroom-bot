const client = require('../../index.js');

module.exports.list = [
  {displayName: "Cookie", itemName: 'cookie', itemIcon: `${client.emojis.cache.get("835984983826366505")}`, itemPrice: 10, itemDescription: 'Tasty snack. Includes chocolate chips!', itemType: 'CONSUMABLE', itemCount: 1},
  {displayName: "Handgun", itemName: "handgun", itemIcon: `${client.emojis.cache.get("835973355625906218")}`, itemPrice: 400, itemDescription: 'Used for robberies, increase your chances of success!', itemType: 'TOOL', itemCount: 1},
  {displayName: "Fishing Rod", itemName: 'fishingrod', itemIcon: `${client.emojis.cache.get("837744148584595496")}`, itemPrice: 500, itemDescription: 'Standard fishing rod made of oyster bamboo. Unlocks the **fish** command.', itemType: 'TOOL', itemCount: 1},
  {displayName: "Hunting Rifle", itemName: 'huntingrifle', itemIcon: `${client.emojis.cache.get("842169964885442630")}`, itemPrice: 1500, itemDescription: 'Standard hunting rifle made from American wood. Includes hunting permit. Unlocks the **hunt** command.', itemType: 'TOOL', itemCount: 1},
  {displayName: "Crown of Arabia", itemName: 'crownofarabia', itemIcon: `👑`, itemPrice: 9999999, itemDescription: 'Ancient crown made for the richest of the rich.', itemType: 'TREASURE', itemCount: 1},
]
