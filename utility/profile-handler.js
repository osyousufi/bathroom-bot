module.exports = {
  async set(profileModel, user) {
    let profile = await profileModel.create({
          userID: user.id,
          rupees: 1000,
          bank: 0,
          inventory: []
        });
        profile.save();
  }
}
