const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();
const profileModel = require('../../models/profileSchema');

module.exports = {
  name: "fish",
  cooldown: 120,
  description: "Go fishing! Requires a fishing rod. Uses the best fishing rod in your inventory automatically",
  async execute(message, args, profileData, client, prefix) {

    const oldrod = await profileData.inventory.some(i => i.itemName == 'oldrod');
    const goodrod = await profileData.inventory.some(i => i.itemName == 'goodrod');
    const ancientrod = await profileData.inventory.some(i => i.itemName == 'ancientrod');

    let bite;
    if (ancientrod) {
      bite = chance.bool({likelihood: 95});
    } else if (goodrod) {
      bite = chance.bool({likelihood: 75});
    } else if (oldrod) {
      bite = chance.bool({likelihood: 50});
    }


    const fishData = {
      'SHRIMP': {
        displayName: 'Shrimp',
        itemName: 'shrimp',
        itemIcon: '🦐',
        itemDescription: 'Low-tier catch.',
        itemPrice: 50,
        itemType: 'MARKET',
        catchRate: 85,
        failChance: false,
        itemCount: 1,
      },
      'SALMON': {
        displayName: 'Salmon',
        itemName: 'salmon',
        itemIcon: '🐟',
        itemDescription: 'Low-tier catch.',
        itemPrice: 85,
        itemType: 'MARKET',
        catchRate: 85,
        failChance: false,
        itemCount: 1,
      },
      'CRAB': {
        displayName: 'Crab',
        itemName: 'crab',
        itemIcon: '🦀',
        itemDescription: 'Low-tier catch.',
        itemPrice: 85,
        itemType: 'MARKET',
        catchRate: 85,
        failChance: false,
        itemCount: 1,
      },
      'LOBSTER': {
        displayName: 'Lobster',
        itemName: 'lobster',
        itemIcon: '🦞',
        itemDescription: 'Low-tier catch.',
        itemPrice: 250,
        itemType: 'MARKET',
        catchRate: 80,
        failChance: false,
        itemCount: 1,
      },
      'SQUID': {
        displayName: 'Squid',
        itemName: 'squid',
        itemIcon: '🦑',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 500,
        itemType: 'MARKET',
        catchRate: 80,
        failChance: false,
        itemCount: 1,
      },
      'BLOWFISH': {
        displayName: 'Blowfish',
        itemName: 'blowfish',
        itemIcon: '🐡',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 750,
        itemType: 'MARKET',
        catchRate: 75,
        failChance: false,
        itemCount: 1,
      },
      'OCTOPUS': {
        displayName: 'Octopus',
        itemName: 'octopus',
        itemIcon: '🐙',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 1000,
        itemType: 'MARKET',
        catchRate: 70,
        failChance: false,
        itemCount: 1,
      },
      'TROPICFISH': {
        displayName: 'Tropical Fish',
        itemName: 'tropicalfish',
        itemIcon: '🐠',
        itemDescription: 'Rare catch. Has a nice gold tint to it.',
        itemPrice: 5000,
        itemType: 'MARKET',
        catchRate: 40,
        failChance: false,
        itemCount: 1,
      },
      'CROC': {
        displayName: 'Crocodile',
        itemName: 'crocodile',
        itemIcon: '🐊',
        itemDescription: 'Rare catch. How did this get here?',
        itemPrice: 10000,
        itemType: 'MARKET',
        catchRate: 30,
        failChance: true,
        itemCount: 1,
      },
      'DOLPHIN': {
        displayName: 'Dolphin',
        itemName: 'dolphin',
        itemIcon: '🐬',
        itemDescription: 'Rare catch.',
        itemPrice: 20000,
        itemType: 'MARKET',
        catchRate: 20,
        failChance: true,
        itemCount: 1,
      },
      'SHARK': {
        displayName: 'Shark',
        itemName: 'shark',
        itemIcon: '🦈',
        itemDescription: 'Legendary catch. Underworld delicacy.',
        itemPrice: 100000,
        itemType: 'MARKET',
        catchRate: 10,
        failChance: true,
        itemCount: 1,
      },
      'WHALE': {
        displayName: 'Whale',
        itemName: 'whale',
        itemIcon: '🐋',
        itemDescription: 'Legendary catch. How the hell did you catch this?!',
        itemPrice: 300000,
        itemType: 'MARKET',
        catchRate: 5,
        failChance: true,
        itemCount: 1,
      },
    }


    let result;
    let fishEmbed = new Discord.MessageEmbed()
      .setColor('DARK_AQUA')
      .setTitle(`${message.author.username}`)

    const catchFish = async (name) => {

      let fish = fishData[name];
      let catchChance;

      if (ancientrod) {
        catchChance = chance.bool({likelihood: fish.catchRate + 10});
      } else if (goodrod) {
        catchChance = chance.bool({likelihood: fish.catchRate + 5});
      } else if (oldrod) {
        catchChance = chance.bool({likelihood: fish.catchRate});
      }


      if (catchChance) {
        result = flashEmbed.display('GREEN', `${message.author.username},`, `Successfully caught: ${fish.itemIcon} __${fish.displayName}__`)
        await profileModel.findOne({
          userID: message.author.id
        }, async (err, res) => {

            if(res.inventory.length >= 10) {
              return message.lineReply(
                flashEmbed.display('RED', `${message.author.username},`, `Your inventory is full!`)
              )
            }
            const inInventory = await res.inventory.find(i => i.itemName == fish.itemName)
            const idx = res.inventory.indexOf(inInventory)
            if (inInventory) {
              inInventory.itemCount = parseInt(inInventory.itemCount) + 1
              res.inventory.set(idx, inInventory)
              await res.save()
            } else {
              await res.inventory.push(fish)
              await res.save()
            }

          });
        } else {

          if (fish.failChance) {
            result = flashEmbed.display('RED', `${message.author.username},`, `You got a bite but.. things take a turn for the worse and your fishing rod gets pulled in! \n Better luck next time...`)
            await profileModel.findOne({
              userID: message.author.id
            }, async (err, res) => {
              let selectedRod;

              if (ancientrod) {
                selectedRod = await res.inventory.find(i => i.itemName == 'ancientrod')
              } else if (goodrod) {
                goodrod = await res.inventory.find(i => i.itemName == 'goodrod')
              } else if (oldrod) {
                oldrod = await res.inventory.find(i => i.itemName == 'oldrod')
              }

              const idx = res.inventory.indexOf(selectedRod)

              selectedRod.itemCount = parseInt(selectedRod.itemCount) - 1
              res.inventory.set(idx, selectedRod)
              await res.save()

              if (selectedRod.itemCount <= 0) {
                res.inventory.splice(idx, 1)
                await res.save()
              }

            })
          } else {
            result = flashEmbed.display('RED', `${message.author.username},`, `The fish got away. Better luck next time!`)
          }

        }
    }

    if (oldrod || goodrod || ancientrod) {
      if (bite) {
        fishEmbed.setColor('AQUA')
        fishEmbed.setDescription(`You throw your fishing rod into the ocean... \n **You got a bite!** You attempt to reel in your catch...`)
        await message.channel.send(fishEmbed)

        const sea = [
          'WHALE',
          'SHARK',
          
          'DOLPHIN',
          'CROC',
          'TROPICFISH',
          'DOLPHIN',
          'CROC',
          'TROPICFISH',
          'DOLPHIN',
          'CROC',
          'TROPICFISH',
          'TROPICFISH',

          'OCTOPUS',
          'BLOWFISH',
          'SQUID',
          'OCTOPUS',
          'BLOWFISH',
          'SQUID',
          'OCTOPUS',
          'BLOWFISH',
          'SQUID',
          'OCTOPUS',
          'BLOWFISH',
          'SQUID',
          'OCTOPUS',
          'BLOWFISH',
          'SQUID',
          'SQUID',
          'OCTOPUS',
          'BLOWFISH',
          'SQUID',

          'LOBSTER',
          'SHRIMP',
          'SALMON',
          'CRAB',
          'LOBSTER',
          'SHRIMP',
          'SALMON',
          'CRAB',
          'LOBSTER',
          'SHRIMP',
          'SALMON',
          'CRAB',
          'LOBSTER',
          'SHRIMP',
          'SALMON',
          'CRAB',
          'LOBSTER',
          'SHRIMP',
          'SALMON',
          'CRAB',
          'SHRIMP',
          'SALMON',
          'CRAB',
        ]

        const luck = chance.integer({ min: 0, max: (sea.length - 1)})
        const fish = sea[luck]
        catchFish(fish)

        return await message.lineReply(result)
      } else {
        return await message.lineReply(
          flashEmbed.display('RED', `${message.author.username},`, `You throw your fishing rod into the ocean... \n You didn't get anything. Better luck next time!`)
        )
      }


    } else {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `You don't have a fishing rod! \n Maybe the **store** will have one...`)
      )
    }


  }
}
