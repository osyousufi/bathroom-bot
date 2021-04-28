const Discord = require('discord.js');
const ms = require('ms');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
  name: "reminder",
  description: "Set a reminder",
  args: true,
  usage: '<time> <reminder>',
  aliases: ['rm', 'remind'],
  async execute(message, args, profileData, client) {

      let time = args[0];
      let reminder = args.slice(1).join(' ');
      validTimes = ['s', 'm', 'h', 'd']
      // message.channel.send(time.slice(-1))
      // message.channel.send(time.slice(0, -1))

      if (!reminder) {
        return message.lineReply(
          flashEmbed.display('RED', `${message.author.username},`, `Please enter a valid reminder message!`)
        )
      } else if (parseInt(time.slice(0, -1)) % 1 !== 0) {
        return message.lineReply(
          flashEmbed.display('RED', `${message.author.username},`, `Please enter a valid time!`)
        )
      } else if (!validTimes.includes(time.slice(-1))) {
        return message.lineReply(
          flashEmbed.display('RED', `${message.author.username},`, `Please format time properly! \nex: \`10s\` or \`10h\``)
        )
      }

      let reminderEmbed = new Discord.MessageEmbed()
        .setColor('GREEN')
        .setTitle(`${message.author.username}'s reminder set!`)
        .addField('Remind in:', `${time}`)
        .addField(`Reminder:`, `${reminder}`)

      message.channel.send(reminderEmbed);

      setTimeout(async () => {
        let reminderAlertEmbed = new Discord.MessageEmbed()
          .setColor('BLUE')
          .setTitle(`Reminder for ${message.author.username}!`)
          .setDescription(`${reminder}`)

        message.lineReply(
          reminderAlertEmbed
        )
      }, ms(time))
  }
}
