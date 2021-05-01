const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();
const profileModel = require('../../models/profileSchema');

module.exports = {
  name: "fish",
  cooldown: 3,
  description: "Go fishing! Requires a fishing rod.",
  async execute(message, args, profileData, client, prefix) {

    let idx = profileData.inventory.findIndex(item => item.itemName=="Fishing Rod");

    const fishData = {
      'SALMON': {
        itemName: 'Salmon',
        itemIcon: '🐟',
        itemDescription: 'Low-tier catch. Smells funny.',
        itemPrice: 99,
        itemType: 'CONSUMABLE',
        catchRate: 99,
        failRate: 0,
      },
      'BLOWFISH': {
        itemName: 'Blowfish',
        itemIcon: '🐡',
        itemDescription: 'Low-tier catch. Becareful not to touch it!',
        itemPrice: 360,
        itemType: 'CONSUMABLE',
        catchRate: 80,
        failRate: 0,
      },
      'OCTOPUS': {
        itemName: 'Octopus',
        itemIcon: '🐙',
        itemDescription: 'Mid-tier catch. Its tentacles look slimey.',
        itemPrice: 1200,
        itemType: 'CONSUMABLE',
        catchRate: 70,
        failRate: 10,
      },
      'TROPICFISH': {
        itemName: 'Tropicfish',
        itemIcon: '🐠',
        itemDescription: 'Rare catch. Has a nice gold tint to it.',
        itemPrice: 6000,
        itemType: 'CONSUMABLE',
        catchRate: 45,
        failRate: 0,
      },
      'SHARK': {
        itemName: 'Shark',
        itemIcon: '🦈',
        itemDescription: 'Legendary catch. Extremely sought after in the upper class.',
        itemPrice: 30000,
        itemType: 'CONSUMABLE',
        catchRate: 30,
        failRate: 45,
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
          result = flashEmbed.display('GREEN', `${message.author.username},`, `Successfully caught: ${fish.itemIcon} __${fish.itemName}__`)
          await profileModel.findOne({
              userID: message.author.id
            }, (err, res) => {
              if(res.inventory.length >= 10) {
                return message.lineReply(
                  flashEmbed.display('RED', `${message.author.username},`, `Your inventory is full!`)
                )
              } else {
                res.inventory.push(fish)
                res.save()
              }
            });
        } else {
          result = flashEmbed.display('RED', `${message.author.username},`, `The fish got away. Better luck next time!`)
        }
      } else {
        result = flashEmbed.display('RED', `${message.author.username},`, `Things take a turn for the worse and your fishing rod gets pulled in! \n Better luck next time...`)
        let idx = profileData.inventory.findIndex(i => i.itemName==`Fishing Rod`);
        await profileData.inventory.splice(idx, 1)
        await profileData.save();
      }

    }

    if (idx !== -1) {

      const bite = chance.bool({likelihood: 80});
      const luck = chance.integer({ min: 1, max: 100});

      if (bite) {

        fishEmbed.setColor('AQUA')
        fishEmbed.setDescription(`You throw your fishing rod into the ocean... \n **You got a bite!** You attempt to reel in your catch...`)
        await message.channel.send(fishEmbed)

        if(luck > 94) {
          catchFish('SHARK')
        } else if (luck < 95  && luck > 84){
          catchFish('TROPICFISH')
        } else if (luck < 85  && luck > 64){
          catchFish('OCTOPUS')
        } else if (luck < 65  && luck > 35){
          catchFish('BLOWFISH')
        } else {
          catchFish('SALMON')
        }

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
