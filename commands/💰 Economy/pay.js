const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require("../../models/profileSchema");
const profileHandler = require('../../utility/profile-handler.js');

module.exports = {
  name: "pay",
  args: true,
  mention: true,
  usage: '<@username> <amount>',
  description: "Give a user money",
  async execute(message, args, profileData, client, prefix) {

    const amount = args[1];
    const taggedUser = message.mentions.users.first();

    try {
      if (!amount) {
        return message.lineReply(
          flashEmbed.display('#FF0000', `${message.author.username},`, `Please specify an amount to pay!`)
        )
      } else if (amount % 1 !== 0 || amount <= 0) {
        return message.lineReply(
          flashEmbed.display('#FF0000', `${message.author.username},`, `Amount must be a positive whole number! \nThe proper usage would be: \`${prefix}<@username> <amount>\``)
        )
      } else if (amount > profileData.wallet) {
        return message.lineReply(
          flashEmbed.display('#FF0000', `${message.author.username},`, `You do not have that much money!`)
        )
      } else if (taggedUser == message.author) {
        return message.lineReply(
          flashEmbed.display('#FF0000', `${message.author.username},`, `Why are you paying money to yourself?`)
        )
      }

      const taggedProfileData = await profileModel.findOne({ userID: taggedUser.id });
      if (!taggedProfileData) {
        profileHandler.set(profileModel, taggedUser);
      }

      let counter = 0
      const questions = [
        `Are you sure you want to pay **\`${Number(amount).toString()}\`** rupees to ${taggedUser.username}? \nType \`yes\` or \`no\``
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
          return message.lineReply (
            flashEmbed.display('#FF0000', `${message.author.username},`, `You did not answer in time!`)
          )
        }

        const validResult = ['yes', 'no', 'y', 'n'];
        mCollected.forEach(async (value) => {
          let confirmResult = value.content;
          if (!validResult.includes(confirmResult)) {
            return message.lineReply(
              flashEmbed.display('#FF0000', `${message.author.username},`, `Please enter a valid response!`)
            )
          } else if (confirmResult == 'yes' || confirmResult == 'y') {

            await profileModel.findOneAndUpdate({
                userID: message.author.id
              }, { $inc: { wallet: -amount }});

            await profileModel.findOneAndUpdate({
                userID: taggedUser.id
              }, { $inc: { wallet: +amount }});

            return message.channel.send(
              flashEmbed.display('#00FF00', `${message.author.username},`, `Paid ${taggedUser.username} **\`${Number(amount).toString()}\`** rupees from your wallet!`)
            )

          } else {
            message.lineReply(
              flashEmbed.display('#FF0000', `${message.author.username},`, `Canceled payment.`)
            )
          }

        });

      });

    } catch (e) {
      console.log(e)
    }


  }
}
