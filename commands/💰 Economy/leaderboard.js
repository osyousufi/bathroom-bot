const profileModel = require('../../models/profileSchema');
const flashEmbed = require('../../utility/flash-embed.js');
const Discord = require('discord.js');

module.exports = {
  name: "leaderboard",
  aliases: ['lb', 'rich', 'richest'],
  description: "Display leaderboard for the guild.",
  async execute(message, args, profileData, client) {

    try {
      
      let usersArr = [];
      const memberData = await profileModel.find({}, (err, users) => {

        users.forEach(async (user) => {
          const userName = await client.users.fetch(user.userID);
          const netWorth = user.rupees + user.bank;
          let userObj = {
            userName: userName.username,
            netWorth: netWorth
          }

          await usersArr.push(userObj);
        })

      });


      usersArr.sort((a, b) => b.netWorth - a.netWorth);
      usersArr = usersArr.slice(0, 10);

      const lbEmbed = new Discord.MessageEmbed().setTitle('Richest Users Rankings:')
      for (let index = 0; index < usersArr.length; index++) {
        lbEmbed.addField(`${(index + 1)}. ${usersArr[index].userName}`, `Net worth: \`${usersArr[index].netWorth}\` rupees`)
      }
      usersArr = usersArr
      await setTimeout(() => {
        return message.lineReplyNoMention(lbEmbed)
      }, 2000)

    } catch (e) {
      console.log(err)
    }



  }
}
