const profileModel = require('../../models/profileSchema');
const flashEmbed = require('../../utility/flash-embed.js');
const Discord = require('discord.js');

module.exports = {
  name: "leaderboard",
  aliases: ['lb', 'rich', 'richest'],
  cooldown: 5,
  description: "Display leaderboard for the guild.",
  async execute(message, args, profileData, client) {

    let lbEmbed = new Discord.MessageEmbed().setTitle('Richest Users Rankings:').setColor('DARK_GREEN');
    let sortedUsers = await profileModel.find({}, null, {sort: { bank : -1 }}, (err, res) => {});

    sortedUsers = sortedUsers.slice(0, 10)
    await sortedUsers.forEach(async (user, index) => {
      const userName = await client.users.cache.find(u => u.id === user.userID)
      await lbEmbed.addField(`${(index + 1)}. ${userName.username}`, `Net worth: \`${user.bank + user.wallet}\` rupees`);
    });

    return message.channel.send(lbEmbed);

  }
}
