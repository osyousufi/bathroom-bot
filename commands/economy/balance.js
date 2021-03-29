module.exports = {
  name: 'balance',
  description: 'List balance of user',
  usage: '<@username>',
  aliases: ['bal'],
  guildOnly: true,
  execute(message, args) {
    message.channel.send('getting balance')
  }
}
