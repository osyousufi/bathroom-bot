module.exports = {
  async set(profileModel, user) {
    let profile = await profileModel.create({
          userID: user.id,
          rupees: 1000,
          bank: 0,
          inventory: [],
          bjStats: {wins: 0, losses: 0},
        });
        profile.save();
  }
}
