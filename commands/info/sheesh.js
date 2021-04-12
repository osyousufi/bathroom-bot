const sheeshModel = require("../../models/sheesh-model")

module.exports = {
  name: "sheesh",
  guildOnly: true,
  async execute(message, args) {


    await sheeshModel.findOne({}, (err, obj) => {
      currCount = obj.Count
      message.channel.send(`the current sheesh count is: ${currCount}`);
    });



  }
}
