const profileModel = require('../models/profileSchema');

module.exports = {

  load(client) {

    client.on('guildMemberAdd', async (member) => {

      console.log(`someone joined!`)

      let profile = await profileModel.create({
        userID: member.id,
        rupees: 1400,
        bank: 0,
        inventory: []
      });
      profile.save();

    });

    client.on('guildMemberRemove', (member) => {
      console.log(`someone left!`)
    });

  }

}
