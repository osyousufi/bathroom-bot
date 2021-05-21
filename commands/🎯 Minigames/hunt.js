const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();
const profileModel = require('../../models/profileSchema');

module.exports = {
  name: "hunt",
  cooldown: 60,
  description: "Go hunting! Requires a hunting rifle.",
  async execute(message, args, profileData, client, prefix) {

    return message.channel.send('not done yet, almost done tho')
    let rifle = await profileData.inventory.some(i => i.itemName == 'huntingrifle');

    let encounter = chance.bool({likelihood: 65});

    const huntData = {
      'DUCK': {
        displayName: 'Duck',
        itemName: 'duck',
        itemIcon: '🦆',
        itemDescription: 'Low-tier catch.',
        itemPrice: 50,
        itemType: 'MARKET',
        catchRate: 85,
        failChance: false,
        itemCount: 1,
      },

    }


    let result;
    let huntEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}`)

    const huntPrey = async (name) => {

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

    if (rifle) {
      if (encounter) {
        huntEmbed.setColor('DARK_ORANGE')
        huntEmbed.setDescription(`You enter the woods looking for prey... \n **You see something in the distance!** You take the shot...`)
        await message.channel.send(huntEmbed)

        const forest = [
          'WHALE',
          'SHARK',

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
        ]

        const luck = chance.integer({ min: 0, max: (sea.length - 1)})
        huntPrey(forest[luck])

        return await message.lineReply(result)
      } else {
        return await message.lineReply(
          flashEmbed.display('RED', `${message.author.username},`, `You enter the woods looking for prey... \n You didn't find anything. Better luck next time!`)
        )
      }


    } else {
      return message.lineReply(
        flashEmbed.display('RED', `${message.author.username},`, `You don't have a hunting rifle! \n Maybe the **store** will have one...`)
      )
    }


  }
}
