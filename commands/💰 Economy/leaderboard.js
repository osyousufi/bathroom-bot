const profileModel = require('../../models/profileSchema');
const flashEmbed = require('../../utility/flash-embed.js');
const Discord = require('discord.js');

module.exports = {
  name: "leaderboard",
  aliases: ['lb', 'rich', 'richest'],
  cooldown: 5,
  description: "Display leaderboard for the guild.",
  async execute(message, args, profileData, client) {

    let usersArr = [];
    try {
      await profileModel.find({}, (err, users) => {
         if (err) {
           console.log(err)
         } else {
           users.forEach(async (user) => {
             const userName = await client.users.fetch(user.userID);
             const netWorth = await (user.wallet + user.bank);
             let userObj = {
               userName: userName.username,
               netWorth: netWorth
             }

             await usersArr.push(userObj);
           })
         }

      });

      await usersArr.sort((a, b) => b.netWorth - a.netWorth);
      usersArr = await usersArr.slice(0, 10);

      const lbEmbed = new Discord.MessageEmbed().setTitle('Richest Users Rankings:').setColor('#00FF00');

      for (let index = 0; index < usersArr.length; index++) {
        await lbEmbed.addField(`${(index + 1)}. ${usersArr[index].userName}`, `Net worth: \`${usersArr[index].netWorth}\` rupees`);
      }
      console.log(usersArr)
      await message.channel.send(lbEmbed)


    } catch (e) {
      console.log(err)
    }

  }
}
