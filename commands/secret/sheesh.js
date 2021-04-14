const sheeshModel = require("../../models/sheeshSchema")

module.exports = {
  name: "sheesh",
  description: "sheesh counter for jerry's server",
  guildOnly: true,
  async execute(message, args) {

    if (message.guild.id == 771996817507352606) {
      await sheeshModel.findOne({}, (err, obj) => {
        currCount = obj.Count
        message.channel.send(`the current sheesh count is: ${currCount}`);
      });
    } else {
      return
    }

  }
}
