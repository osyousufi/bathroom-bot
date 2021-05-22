const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();
const profileModel = require('../../models/profileSchema');

module.exports = {
  name: "hunt",
  cooldown: 120,
  description: "Go hunting! Requires a hunting rifle.",
  async execute(message, args, profileData, client, prefix) {

    let rifle = await profileData.inventory.some(i => i.itemName == 'huntingrifle');

    let encounter = chance.bool({likelihood: 65});

    const huntData = {
      'DUCK': {
        displayName: 'Duck',
        itemName: 'duck',
        itemIcon: '🦆',
        itemDescription: 'Low-tier catch.',
        itemPrice: 25,
        itemType: 'MARKET',
        catchRate: 95,
        failChance: false,
        itemCount: 1,
      },
      'TURKEY': {
        displayName: 'Turkey',
        itemName: 'turkey',
        itemIcon: '🦃',
        itemDescription: 'Low-tier catch.',
        itemPrice: 35,
        itemType: 'MARKET',
        catchRate: 95,
        failChance: false,
        itemCount: 1,
      },
      'RABBIT': {
        displayName: 'Rabbit',
        itemName: 'rabbit',
        itemIcon: '🐇',
        itemDescription: 'Low-tier catch.',
        itemPrice: 100,
        itemType: 'MARKET',
        catchRate: 95,
        failChance: false,
        itemCount: 1,
      },
      'GOAT': {
        displayName: 'Goat',
        itemName: 'goat',
        itemIcon: '🐐',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 500,
        itemType: 'MARKET',
        catchRate: 85,
        failChance: false,
        itemCount: 1,
      },
      'BOAR': {
        displayName: 'Boar',
        itemName: 'boar',
        itemIcon: '🐗',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 800,
        itemType: 'MARKET',
        catchRate: 80,
        failChance: false,
        itemCount: 1,
      },
      'WOLF': {
        displayName: 'Wolf',
        itemName: 'wolf',
        itemIcon: '🦌',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 1500,
        itemType: 'MARKET',
        catchRate: 70,
        failChance: false,
        itemCount: 1,
      },
      'DEER': {
        displayName: 'Deer',
        itemName: 'deer',
        itemIcon: '🦌',
        itemDescription: 'Mid-tier catch.',
        itemPrice: 2500,
        itemType: 'MARKET',
        catchRate: 65,
        failChance: false,
        itemCount: 1,
      },
      'BEAR': {
        displayName: 'Bear',
        itemName: 'bear',
        itemIcon: '🐻',
        itemDescription: 'Rare catch.',
        itemPrice: 15000,
        itemType: 'MARKET',
        catchRate: 35,
        failChance: true,
        itemCount: 1,
      },
      'ELEPHANT': {
        displayName: 'Elephant',
        itemName: 'elephant',
        itemIcon: '🐘',
        itemDescription: 'Legendary catch.',
        itemPrice: 45000,
        itemType: 'MARKET',
        catchRate: 10,
        failChance: false,
        itemCount: 1,
      },
      'RHINO': {
        displayName: 'Rhino',
        itemName: 'rhino',
        itemIcon: '🦏',
        itemDescription: 'Legendary catch.',
        itemPrice: 70000,
        itemType: 'MARKET',
        catchRate: 5,
        failChance: true,
        itemCount: 1,
      },

    }

    let result;
    let huntEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}`)

    const huntPrey = async (name) => {

      let prey = huntData[name];
      let catchChance = chance.bool({likelihood: prey.catchRate});

      if (catchChance) {
        result = flashEmbed.display('GREEN', `${message.author.username},`, `Successfully hunted: **x${prey.itemCount}** ${prey.itemIcon} __${prey.displayName}__`)
        await profileModel.findOne({
          userID: message.author.id
        }, async (err, res) => {

            if(res.inventory.length >= 10) {
              return message.lineReply(
                flashEmbed.display('RED', `${message.author.username},`, `Your inventory is full!`)
              )
            }
            const inInventory = await res.inventory.find(i => i.itemName == prey.itemName)
            const idx = res.inventory.indexOf(inInventory)
            if (inInventory) {
              inInventory.itemCount = parseInt(inInventory.itemCount) + prey.itemCount
              res.inventory.set(idx, inInventory)
              await res.save()
            } else {
              await res.inventory.push(prey)
              await res.save()
            }

          });
        } else {

          if (prey.failChance) {
            result = flashEmbed.display('RED', `${message.author.username},`, `You found prey but... the animal stands its ground, causing you to flee and leave your rifle behind! \n Better luck next time...`)
            await profileModel.findOne({
              userID: message.author.id
            }, async (err, res) => {

              rifle = res.inventory.find(i => i.itemName == 'huntingrifle');
              const idx = res.inventory.indexOf(rifle)

              rifle.itemCount = parseInt(rifle.itemCount) - 1
              res.inventory.set(idx, rifle)
              await res.save()

              if (rifle.itemCount <= 0) {
                res.inventory.splice(idx, 1)
                await res.save()
              }

            })
          } else {
            result = flashEmbed.display('RED', `${message.author.username},`, `The prey got away. Better luck next time!`)
          }

        }
    }

    if (rifle) {
      if (encounter) {
        huntEmbed.setColor('DARK_GOLD')
        huntEmbed.setDescription(`You enter the woods looking for prey... \n **You see something in the distance!** You take the shot...`)
        await message.channel.send(huntEmbed)

        const luck = chance.integer({ min: 0, max: (Object.keys(huntData).length - 1)})
        huntPrey(Object.keys(huntData)[luck])

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
