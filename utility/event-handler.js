const profileModel = require('../models/profileSchema');
const profileHandler = require('./profile-handler.js');
const flashEmbed = require('./flash-embed.js');

module.exports = {
  load(client) {

    client.on('guildMemberAdd', async (member) => {

      let profileData = await profileModel.findOne({ userID: member.id });
      if (!profileData) profileHandler.set(profileModel, member);

    });

    client.on('guildMemberRemove', (member) => {
    });

    let defaultChannel = "";
    client.on('guildCreate', guild => {
      guild.channels.cache.forEach((channel) => {
        if(channel.type == "text" && defaultChannel == "") {
          if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
            defaultChannel = channel;
          }
        }
      })
      defaultChannel.send(`Yo! Get started with **\`//help\`**`);
    })


  }
}
