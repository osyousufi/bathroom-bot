const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();

module.exports = {
	name: 'coinflip',
	aliases: ['cf', 'coinf', 'flipcoin'],
	description: 'Flips a coin)',
	execute(message, args) {

    const flipCoin = () => {
      const successful = chance.bool();
      if (successful) {
        return message.lineReplyNoMention(
          flashEmbed.display('green', 'Heads!', '')
        )
      } else {
        return message.lineReplyNoMention(
          flashEmbed.display('green', 'Tails!', '')
        )
      }
    }

    message.channel.send(
      flashEmbed.display(null, 'Flipping coin...', '')
    )
    setTimeout(() => {
      flipCoin();
    }, 2500)




  }
};
