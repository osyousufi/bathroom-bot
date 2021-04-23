const Discord = require('discord.js');
module.exports = {
  name: "debug",
  // cooldown: 86400,
  description: "debug command for osyou",
  async execute(message, args) {

    message.channel.send('debugging')

  }
}

// name: 'name',
// args: true,
// guildOnly: true,
// mention: true,
// usage: '<@username>',
// aliases: ['al1', 'al2'],
// description: 'desc here',
// perms: 'PERM_HERE',
// cooldown: 5,


// example perms:
// CREATE_INSTANT_INVITE
// KICK_MEMBERS
// BAN_MEMBERS
// MANAGE_CHANNELS
// MANAGE_GUILD
// ADD_REACTIONS
// VIEW_AUDIT_LOG
// STREAM
// VIEW_CHANNEL
// SEND_MESSAGES
// SEND_TTS_MESSAGES
// MANAGE_MESSAGES
// EMBED_LINKS
// ATTACH_FILES
// READ_MESSAGE_HISTORY
// MENTION_EVERYONE
// USE_EXTERNAL_EMOJIS
// VIEW_GUILD_INSIGHTS
// CONNECT
// SPEAK
// MUTE_MEMBERS
// DEAFEN_MEMBERS
// MOVE_MEMBERS
// USE_VAD
// CHANGE_NICKNAME
// MANAGE_NICKNAMES
// MANAGE_ROLES
// MANAGE_WEBHOOKS
// MANAGE_EMOJIS


//discarded code:
// client.guilds.cache.get(message.guild.id).members.cache.forEach(async member => {
    //
    //   let memberData;
    //   try {
    //     memberData = await profileModel.findOne({ userID: member.user.id });
    //     if(!memberData) {
    //       let profile = await profileModel.create({
    //         userID: member.user.id,
    //         rupees: 1000,
    //         bank: 0
    //       });
    //       profile.save();
    //     }
    //   } catch (err) {
    //      console.log(err);
    //   }
    //   membersArr.push(memberData)
    //
    // });
    // await console.log(membersArr)

    // let dbUsers = [];
    // membersArr.forEach(async (id) => {
    //   const result = await profileModel.find({userID: id}).toObject();
    //   console.log(result)
    // })


    // await console.log(dbUsers)

    // if (obj) {
    //
    //   let membersObj = {
    //     userName: member.user.username,
    //     netWorth: obj.rupees + obj.bank
    //   }
    //   await console.log(membersObj)
    //   membersArr.push(membersObj)
    // }
    // await message.lineReplyNoMention(
    //   flashEmbed.display('#00FF00',`${message.author.username},`, `you received your daily stimulus of **\`${dailyValue}\`** rupees!`)
    // );

// const sheeshModel = require("../../models/sheeshSchema")
//
// module.exports = {
//   name: "sheesh",
//   description: "sheesh counter for jerry's server",
//   guildOnly: true,
//   async execute(message, args) {
//
//     // if (message.content === 'SHEESH' && message.channel.id == 825656630115827712) {
//     //   await sheeshModel.findByIdAndUpdate("60739b967d146e235000dfc4", {$inc: {Count: 1} });
//     // }
//     // if (message.guild.id == 771996817507352606) {
//     //   await sheeshModel.findOne({}, (err, obj) => {
//     //     currCount = obj.Count
//     //     message.channel.send(`the current sheesh count is: ${currCount}`);
//     //   });
//     // } else {
//     //   return
//     // }
//
//   }
// }
