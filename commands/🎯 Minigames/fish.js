const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();
const profileModel = require('../../models/profileSchema');

module.exports = {
  name: "fish",
  cooldown: 60,
  description: "Go fishing! Requires a fishing rod.",
  async execute(message, args, profileData, client, prefix) {

    let rod = await profileData.inventory.some(i => i.itemName == 'fishingrod');

    let bite = chance.bool({likelihood: 75});

    const shrimpCount = chance.integer({ min: 2, max: 21})
    const salmonCount = chance.integer({ min: 1, max: 10})
    const crabCount = chance.integer({ min: 1, max: 7})
    const squidCount = chance.integer({ min: 1, max: 6})
    const lobsterCount = chance.integer({ min: 1, max: 5})


    const fishData = {
      'SHRIMP': {
        displayName: 'Shrimp',
        itemName: 'shrimp',
        itemIcon: '🦐',
        itemDescription: 'Low-tier catch.',
        itemPrice: 12,
        itemType: 'MARKET',
        catchRate: 95,
        failChance: false,
        itemCount: shrimpCount,
      },
      'SALMON': {
        displayName: 'Salmon',
        itemName: 'salmon',
        itemIcon: '🐟',
        itemDescription: 'Low-tier catch.',
        itemPrice: 25,
        itemType: 'MARKET',
        catchRate: 95,
        failChance: false,
        itemCount: salmonCount,
      },
      'SQUID': {
        displayName: 'Squid',
        itemName: 'squid',
        itemIcon: '🦑',
        itemDescription: 'Low-tier catch.',
        itemPrice: 40,
        itemType: 'MARKET',
        catchRate: 90,
        failChance: false,
        itemCount: squidCount,
      },
      'CRAB': {
        displayName: 'Crab',
        itemName: 'crab',
        itemIcon: '🦀',
        itemDescription: 'Low-tier catch.',
        itemPrice: 55,
        itemType: 'MARKET',
        catchRate: 90,
        failChance: false,
        itemCount: crabCount,
      },
      'LOBSTER': {
        displayName: 'Lobster',
        itemName: 'lobster',
        itemIcon: '🦞',
        itemDescription: 'Low-tier catch.',
        itemPrice: 100,
        itemType: 'MARKET',
        catchRate: 90,
        failChance: false,
        itemCount: lobsterCount,
      },
      'BLOWFISH': {
        displayName: 'Blowfish',
        itemName: 'blowfish',
        itemIcon: '🐡',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 750,
        itemType: 'MARKET',
        catchRate: 85,
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
        catchRate: 85,
        failChance: false,
        itemCount: 1,
      },
      'TROPICFISH': {
        displayName: 'Tropical Fish',
        itemName: 'tropicalfish',
        itemIcon: '🐠',
        itemDescription: 'Rare catch. Has a nice gold tint to it.',
        itemPrice: 3000,
        itemType: 'MARKET',
        catchRate: 45,
        failChance: false,
        itemCount: 1,
      },
      'CROC': {
        displayName: 'Crocodile',
        itemName: 'crocodile',
        itemIcon: '🐊',
        itemDescription: 'Rare catch. How did this get here?',
        itemPrice: 5000,
        itemType: 'MARKET',
        catchRate: 50,
        failChance: true,
        itemCount: 1,
      },
      'DOLPHIN': {
        displayName: 'Dolphin',
        itemName: 'dolphin',
        itemIcon: '🐬',
        itemDescription: 'Rare catch.',
        itemPrice: 25000,
        itemType: 'MARKET',
        catchRate: 30,
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
        catchRate: 15,
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
      .setTitle(`${message.author.username}`)

    const catchFish = async (name) => {

      let fish = fishData[name];
      let catchChance = chance.bool({likelihood: fish.catchRate});

      if (catchChance) {
        result = flashEmbed.display('GREEN', `${message.author.username},`, `Successfully caught: **x${fish.itemCount}** ${fish.itemIcon} __${fish.displayName}__`)
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
              inInventory.itemCount = parseInt(inInventory.itemCount) + fish.itemCount
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

              rod = res.inventory.find(i => i.itemName == 'fishingrod');
              const idx = res.inventory.indexOf(rod)

              rod.itemCount = parseInt(rod.itemCount) - 1
              res.inventory.set(idx, rod)
              await res.save()

              if (rod.itemCount <= 0) {
                res.inventory.splice(idx, 1)
                await res.save()
              }

            })
          } else {
            result = flashEmbed.display('RED', `${message.author.username},`, `The fish got away. Better luck next time!`)
          }

        }
    }

    if (rod) {
      if (bite) {
        fishEmbed.setColor('AQUA')
        fishEmbed.setDescription(`You throw your fishing rod into the ocean... \n **You got a bite!** You attempt to reel in your catch...`)
        message.channel.send(fishEmbed)

        const sea = [
          'WHALE',
          'SHARK',
          'DOLPHIN',
          'CROC',
          'TROPICFISH',
          'OCTOPUS',
          'BLOWFISH',
          'SQUID',
          'LOBSTER',
          'SHRIMP',
          'SALMON',
          'CRAB',
        ]

        const luck = chance.integer({ min: 0, max: (sea.length - 1)})
        catchFish(sea[luck])

        setTimeout(() => {
          return message.lineReply(result)
        }, 5000)

      } else {
        return message.lineReply(
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
