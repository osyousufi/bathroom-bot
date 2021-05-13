const flashEmbed = require('../../utility/flash-embed.js');
const chance = new (require('chance'))();

module.exports = {
	name: 'coinflip',
	aliases: ['cf', 'coinf', 'flipcoin'],
	description: 'Flips a coin',
	execute(message, args) {

    const flipCoin = () => {
      const successful = chance.bool();
      if (successful) {
        return message.lineReplyNoMention(
          flashEmbed.display('GREEN', 'Heads!', '')
        )
      } else {
        return message.lineReplyNoMention(
          flashEmbed.display('GREEN', 'Tails!', '')
        )
      }
    }

    message.channel.send(
      flashEmbed.display('BLACK', 'Flipping coin...', '')
    )
    setTimeout(() => {
      flipCoin();
    }, 2500)




  }
};
