const Discord = require('discord.js');
const profileModel = require("../../models/profileSchema");
const flashEmbed = require('../../utility/flash-embed.js');
const profileHandler = require('../../utility/profile-handler.js');

module.exports = {
  name: 'balance',
  description: 'List balance of user',
  usage: '@username(optional)',
  aliases: ['bal', 'money', 'cash', 'wallet', 'bank'],
  async execute(message, args, profileData) {

    const user = message.mentions.users.first() || message.member.user

    try {

      await profileModel.findOne({
        userID: user.id
      }, (err, res) => {
        return message.lineReply(
          flashEmbed.display('GREEN', `${user.username}'s balance:`, `Wallet: **\`${res.wallet}\`** rupees \n\nBank: **\`${res.bank}\`** rupees`)
        );
      });


    } catch (err) {
      return message.lineReply(
        flashEmbed.display('YELLOW', `${message.author.username},`, `Balance has been configured, use this command again.`)
      );
    }


  }
}
