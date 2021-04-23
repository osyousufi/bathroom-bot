const profileModel = require('../models/profileSchema');
const profileHandler = require('./profile-handler.js');

module.exports = {
  load(client) {
    client.on('guildMemberAdd', async (member) => {
      profileHandler.set(profileModel, member);
    });
    client.on('guildMemberRemove', (member) => {
    });
  }
}
