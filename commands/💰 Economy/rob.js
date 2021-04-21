const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require("../../models/profileSchema");
const chance = new (require('chance'))();

module.exports = {
  name: "rob",
  mention: true,
  usage: '<@username>',
  aliases: ['steal'],
  description: "Rob a user",
  // cooldown: 300,
  async execute(message, args, profileData, client, prefix) {

    const taggedUser = message.mentions.users.first();
    let successful;


    const robUser = async (successful, taggedUser) => {
      if(successful) {

        const taggedProfileData = await profileModel.findOne({ userID: taggedUser.id });
        if(!taggedProfileData) {
          let profile = await profileModel.create({
            userID: taggedUser.id,
            rupees: 1000,
            bank: 0,
            inventory: []
          });
          profile.save();
        }

        if (taggedProfileData.rupees <= 0) {
          return message.lineReplyNoMention(
            flashEmbed.display('red', `${message.author.username},`, `${taggedUser.username} is a broke mofo and has no money on them! \nYou run away and get rid of any evidence!`)
          )
        }

        await profileModel.findOneAndUpdate({
                userID: message.author.id
        }, { $inc: { rupees: +taggedProfileData.rupees }});

        await profileModel.findOneAndUpdate({
          userID: taggedUser.id
        }, { $inc: { rupees: -taggedProfileData.rupees }});

        return message.lineReplyNoMention(
          flashEmbed.display('green', `${message.author.username},`, `Your robbery attempt was a success and you stole ${taggedProfileData.rupees} rupees \nYou run away and get rid of any evidence!`)
        )
      } else {

        const fineAmmount = 1000;
        if (profileData.rupees < fineAmmount) {

          await profileModel.findOneAndUpdate({
            userID: message.author.id
          }, { $inc: { bank: -fineAmmount }});

        } else {
          await profileModel.findOneAndUpdate({
            userID: message.author.id
          }, { $inc: { rupees: -fineAmmount }});
        }

        return message.lineReplyNoMention(
          flashEmbed.display('red', `${message.author.username},`, `Your robbery attempt was a failure and you ended up getting fined \`${fineAmmount}\` rupees \nYou get searched and removed of evidence!`)
        )
      }
    }


    try {
      if (taggedUser == message.author) {
        return message.lineReplyNoMention(
          flashEmbed.display('#FF0000', `${message.author.username},`, `Why are you robbing yourself? Loser!`)
        )
      }

      if (profileData.inventory) {

        let idx = profileData.inventory.findIndex(item => item.itemName=="Gun");

        if (idx !== -1) {

          let counter = 0
          const questions = [
            `It appears you have a Gun in your inventory. Would you like to use it to rob ${taggedUser}? \nType \`yes\` or \`no\``
          ];
          const filter = m => m.author.id === message.author.id
          const collector = new Discord.MessageCollector(message.channel, filter, {
            max: questions.length,
            time: 1000 * 15
          });

          message.channel.send(questions[counter++]);

          collector.on('collect', m => {
            if (counter < questions.length) {
              m.channel.send(questions[counter++])
            }
          });

          collector.on('end', mCollected => {
            if (mCollected.size < questions.length) {
              return message.lineReplyNoMention (
                flashEmbed.display('#FF0000', `${message.author.username},`, `You did not answer in time!`)
              )
            }

            const validResult = ['yes', 'no', 'y', 'n'];
            mCollected.forEach(async (value) => {
              let confirmResult = value.content;
              if (!validResult.includes(confirmResult)) {
                return message.lineReplyNoMention(
                  flashEmbed.display('#FF0000', `${message.author.username},`, `Please enter a valid response!`)
                )
              } else if (confirmResult == 'yes' || confirmResult == 'y') {

                await profileData.inventory.splice(idx, 1)
                await profileData.save();
                successful = chance.bool({ likelihood: 75 });
                message.channel.send(
                  flashEmbed.display('green', `${message.author.username},`, `You decided to use your gun. Attempting armed robbery...`)
                )
                robUser(successful, taggedUser)

              } else {
                successful = chance.bool({ likelihood: 5 });
                message.channel.send(
                  flashEmbed.display('red', `${message.author.username},`, `You didn't use your gun. Attempting an unarmed robbery...`)
                )
                robUser(successful, taggedUser)
              }

            });

          });
        } else {
          successful = chance.bool({ likelihood: 5 });
          robUser(successful, taggedUser)
        }

      }

    } catch (e) {
      console.log(e)
    }


  }
}
