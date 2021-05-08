const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();
const profileModel = require('../../models/profileSchema');

module.exports = {
  name: "fish",
  cooldown: 120,
  description: "Go fishing! Requires a fishing rod.",
  async execute(message, args, profileData, client, prefix) {

    let rod = await profileData.inventory.some(i => i.itemName == 'fishingrod');

    const fishData = {
      'SHRIMP': {
        displayName: 'Shrimp',
        itemName: 'shrimp',
        itemIcon: '🦐',
        itemDescription: 'Low-tier catch.',
        itemPrice: 50,
        itemType: 'MARKET',
        catchRate: 99,
        failRate: 0,
        itemCount: 1,
      },
      'SALMON': {
        displayName: 'Salmon',
        itemName: 'salmon',
        itemIcon: '🐟',
        itemDescription: 'Low-tier catch.',
        itemPrice: 100,
        itemType: 'MARKET',
        catchRate: 95,
        failRate: 0,
        itemCount: 1,
      },
      'CRAB': {
        displayName: 'Crab',
        itemName: 'crab',
        itemIcon: '🦀',
        itemDescription: 'Low-tier catch.',
        itemPrice: 150,
        itemType: 'MARKET',
        catchRate: 90,
        failRate: 0,
        itemCount: 1,
      },
      'LOBSTER': {
        displayName: 'Lobster',
        itemName: 'lobster',
        itemIcon: '🦞',
        itemDescription: 'Low-tier catch.',
        itemPrice: 250,
        itemType: 'MARKET',
        catchRate: 90,
        failRate: 0,
        itemCount: 1,
      },
      'SQUID': {
        displayName: 'Squid',
        itemName: 'squid',
        itemIcon: '🦑',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 500,
        itemType: 'MARKET',
        catchRate: 90,
        failRate: 0,
        itemCount: 1,
      },
      'BLOWFISH': {
        displayName: 'Blowfish',
        itemName: 'blowfish',
        itemIcon: '🐡',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 750,
        itemType: 'MARKET',
        catchRate: 85,
        failRate: 0,
        itemCount: 1,
      },
      'OCTOPUS': {
        displayName: 'Octopus',
        itemName: 'octopus',
        itemIcon: '🐙',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 1000,
        itemType: 'MARKET',
        catchRate: 80,
        failRate: 10,
        itemCount: 1,
      },
      'TROPICFISH': {
        displayName: 'Tropical Fish',
        itemName: 'tropicalfish',
        itemIcon: '🐠',
        itemDescription: 'Rare catch. Has a nice gold tint to it.',
        itemPrice: 5000,
        itemType: 'MARKET',
        catchRate: 45,
        failRate: 0,
        itemCount: 1,
      },
      'CROC': {
        displayName: 'Crocodile',
        itemName: 'crocodile',
        itemIcon: '🐊',
        itemDescription: 'Rare catch. How did this get here?',
        itemPrice: 10000,
        itemType: 'MARKET',
        catchRate: 40,
        failRate: 20,
        itemCount: 1,
      },
      'DOLPHIN': {
        displayName: 'Dolphin',
        itemName: 'dolphin',
        itemIcon: '🐬',
        itemDescription: 'Rare catch.',
        itemPrice: 20000,
        itemType: 'MARKET',
        catchRate: 30,
        failRate: 20,
        itemCount: 1,
      },
      'SHARK': {
        displayName: 'Shark',
        itemName: 'shark',
        itemIcon: '🦈',
        itemDescription: 'Legendary catch. Underworld delicacy.',
        itemPrice: 100000,
        itemType: 'MARKET',
        catchRate: 20,
        failRate: 30,
        itemCount: 1,
      },
      'WHALE': {
        displayName: 'Whale',
        itemName: 'whale',
        itemIcon: '🐋',
        itemDescription: 'Legendary catch. How the hell did you catch this?!',
        itemPrice: 300000,
        itemType: 'MARKET',
        catchRate: 15,
        failRate: 40,
        itemCount: 1,
      },
    }


    let result;
    let fishEmbed = new Discord.MessageEmbed()
      .setColor('DARK_AQUA')
      .setTitle(`${message.author.username}`)

    const catchFish = async (name) => {

      let fish = fishData[name];
      const failChance = chance.bool({likelihood: fish.failRate});
      if(!failChance) {
        const catchChance = chance.bool({likelihood: fish.catchRate});

        if (catchChance) {
          result = flashEmbed.display('GREEN', `${message.author.username},`, `Successfully caught: ${fish.itemIcon} __${fish.displayName}__`)
          await profileModel.findOne({
            userID: message.author.id
          }, async (err, res) => {
              if(res.inventory.length >= 10) {
                return message.lineReply(
                  flashEmbed.display('RED', `${message.author.username},`, `Your inventory is full!`)
                )
              } else {

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

              }
            });
        } else {
          result = flashEmbed.display('RED', `${message.author.username},`, `The fish got away. Better luck next time!`)
        }
      } else {
        result = flashEmbed.display('RED', `${message.author.username},`, `Things take a turn for the worse and your fishing rod gets pulled in! \n Better luck next time...`)

          await profileModel.findOne({
            userID: message.author.id
          }, async (err, res) => {
            const selectedRod = await res.inventory.find(i => i.itemName == 'fishingrod')
            const idx = res.inventory.indexOf(selectedRod)

            selectedRod.itemCount = parseInt(selectedRod.itemCount) - 1
            res.inventory.set(idx, selectedRod)
            await res.save()

            if (selectedRod.itemCount <= 0) {
              res.inventory.splice(idx, 1)
              await res.save()
            }

          })

      }

    }

    if (rod) {

      const bite = chance.bool({likelihood: 85});
      const luck = chance.integer({ min: 0, max: 100});


      if (bite) {
        fishEmbed.setColor('AQUA')
        fishEmbed.setDescription(`You throw your fishing rod into the ocean... \n **You got a bite!** You attempt to reel in your catch...`)
        await message.channel.send(fishEmbed)

        const options = [
          'WHALE',
          'SHARK',
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
        ]

        const luck = chance.integer({ min: 0, max: (options.length - 1)});
        const fish = options[luck];
        catchFish(fish);

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
