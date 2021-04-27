const profileModel = require('../../models/profileSchema');
const flashEmbed = require('../../utility/flash-embed.js');
const Discord = require('discord.js');

module.exports = {
  name: "leaderboard",
  aliases: ['lb', 'rich', 'richest'],
  cooldown: 3,
  description: "Display leaderboard for the guild.",
  async execute(message, args, profileData, client) {

    let usersArr = [];
    try {
      await profileModel.find({$or: [{bank: {$gt: 1400}}, {wallet: {$gt: 1400}}]}, async (err, users) => {
         if (err) {
           console.log(err)
         } else {
           await users.forEach(async (user) => {
             const userName = await client.users.fetch(user.userID);
             const netWorth = await (user.wallet + user.bank);
             let userObj = {
               userName: userName.username,
               value: netWorth
             }

            usersArr.push(userObj);
           })
         }

      });

      if (usersArr.length == 0) {
        return message.lineReply(
          flashEmbed.display('red', `${message.author.username},`, `Error. Please wait a bit before using this command.`)
        )
      }
      usersArr.sort((a, b) => b.value - a.value);
      usersArr = usersArr.slice(0, 10);

      const lbEmbed = new Discord.MessageEmbed().setTitle('Richest Users Rankings:').setColor('#00FF00');

      for (let index = 0; index < usersArr.length; index++) {
        lbEmbed.addField(`${(index + 1)}. ${usersArr[index].userName}`, `Net worth: \`${usersArr[index].value}\` rupees`);
      }

      return message.channel.send(lbEmbed)


    } catch (e) {
      console.log(e)
    }

  }
}
