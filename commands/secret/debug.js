const Discord = require('discord.js');
module.exports = {
  name: "debug",
  description: "debug command for osyou",
  secret: true,
  cooldown: 20,
  async execute(message, args) {



    // message.channel.send(message.member.permissions.toArray())
    message.channel.send('debugging...')
    await setTimeout(() => {
      message.channel.send('complete')
    }, 3000)




  }
}

// name: 'name',
// args: true,
// guildOnly: true,
// mention: true,
// usage: '<@username>',
// aliases: ['al1', 'al2'],
// description: 'desc here',
// secret: true,
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
