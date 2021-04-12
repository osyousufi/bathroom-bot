
module.exports = {
	name: 'blackjack',
	guildOnly: true,
	// usage: '<amount>',
	aliases: ['bj'],
	description: 'Blackjack (wip)',
	execute(message, args) {
    message.channel.send('https://osyblackjack.netlify.app/');
  }
};
