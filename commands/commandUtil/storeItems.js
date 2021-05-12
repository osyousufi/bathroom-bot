const client = require('../../index.js');

module.exports.list = [
  {displayName: "Cookie", itemName: 'coo kie', itemIcon: `${client.emojis.cache.get("835984983826366505")}`, itemPrice: 10, itemDescription: 'Tasty snack. Includes chocolate chips!', itemType: 'CONSUMABLE', itemCount: 1},
  {displayName: "Handgun", itemName: "handgun", itemIcon: `${client.emojis.cache.get("835973355625906218")}`, itemPrice: 550, itemDescription: 'Used for robberies, increase your chances of success!', itemType: 'TOOL', itemCount: 1},
  {displayName: "Fishing Rod", itemName: 'fishingrod', itemIcon: `${client.emojis.cache.get("840830142388371457")}`, itemPrice: 4500, itemDescription: 'Cool fishing rod made of oyster bamboo. Unlocks the **fish** command.', itemType: 'TOOL', itemCount: 1},
]
