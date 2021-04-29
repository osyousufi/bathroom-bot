module.exports = {
  async set(profileModel, user) {
    let profile = await profileModel.create({
          userID: user.id,
          wallet: 1000,
          bank: 0,
          inventory: [],
          bjStats: {wins: 0, losses: 0},
          rlStats: {wins: 0, losses: 0},
        });
        profile.save();
  }
}
