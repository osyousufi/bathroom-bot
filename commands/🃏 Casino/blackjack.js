const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require('../../models/profileSchema');

module.exports = {
	name: 'blackjack',
	guildOnly: true,
	usage: '<amount>',
	args: true,
	aliases: ['bj'],
	description: 'Start a blackjack game.',
	async execute(message, args, profileData, client, prefix) {

		let amount = args[0];

		try {
			const bjEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}'s blackjack game:`)
			.setDescription(`Your moves: \`hit\`, \`stand\`, \`double down\` or \`exit\` \nBet: \`${amount === 'all' ? profileData.wallet : amount}\` `)
			.setFooter(`K, Q, J = 10 | A = 1 or 11`);

			if(amount.toLowerCase() === 'all') {

				if (profileData.wallet <= 0) {
          return message.lineReply(
            flashEmbed.display('#FF0000', `${message.author.username},`, `No money in your wallet! broke mf!! LOL`)
          )
        }
				amount = profileData.wallet

			} else if (amount % 1 !== 0 || amount < 10) {
	      return message.lineReply(
	        flashEmbed.display('#FF0000', `${message.author.username},`, `Bet amount must be at least 10 rupees! \nThe proper usage would be: \`${prefix}blackjack <amount>\``)
	      )
	    } else if (amount > profileData.wallet) {
	      return message.lineReply(
	        flashEmbed.display('#FF0000', `${message.author.username},`, `You do not have that much money!`)
	      )
	    }

			let deck = [];
			let playerCards = [];
			let houseCards = [];
			let playerValue = 0;
			let houseValue = 0;
			let gameOver = false;
			let doubleDown = false;
			let doubleDownOption = true;


			const newGame = async () => {
				const suits = ["♠", "♥", "♦", "♣"];
	    	const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
				for (let suit of suits) {
		      for (let value of values) {
		        if (value === 'J' || value === 'Q' || value === 'K') {
		          weight = 10;
		        } else if (value === 'A') {
		          weight = 11;
		        } else {
		          weight = parseInt(value);
		        }
		        let card = {
		          cardValue: value,
		          cardSuit: suit,
		          cardWeight: weight,
		        }
		        deck.push(card);
		      }
	    	}
				shuffleDeck(deck);

				houseCards.push(deck.pop());
				playerCards.push(deck.pop());
				playerCards.push(deck.pop());

				//bj debug
				// playerCards.push({cardValue: 'A', cardSuit: '♦', cardWeight: 11})
				// playerCards.push({cardValue: '10', cardSuit: '♦', cardWeight: 10})

				if (playerCards.some(card => card.cardWeight == 10)) {
					if (playerCards.some(card => card.cardValue == 'A')) {
						gameOver = true;

						await profileModel.findOneAndUpdate({
			        userID: message.author.id
			      }, { $inc: {wallet: (amount * 2.5), "bjStats.wins": +1} })

			      await bjEmbed.setDescription('**BLACKJACK!** You win!').setColor('#800080');
						await message.lineReply(`**You won \`${amount * 1.5}\` rupees! \nYou have: \`${profileData.wallet + parseInt(amount * 1.5)}\` rupees left in your wallet**`);
						await bjEmbed.setFooter(`Wins: ${profileData.get('bjStats.wins') + 1} || Losses: ${profileData.get('bjStats.losses')}`);

						return await message.channel.send(bjEmbed)
					}
				}

			}


			//Knuth Shuffle
			const shuffleDeck = (deckToShuffle) => {
		    let currentIndex = deckToShuffle.length;
		    let tempValue;
		    let randomIndex;

		    while(0 !== currentIndex) {
		      randomIndex = Math.floor(Math.random() * currentIndex);
		      currentIndex -= 1;

		      tempValue = deckToShuffle[currentIndex];
		      deckToShuffle[currentIndex] = deckToShuffle[randomIndex];
		      deckToShuffle[randomIndex] = tempValue;
		    }

		    deck = [...deckToShuffle]
		  }


			const checkAce = (cards, value) => {
				value = 0;
		    for (let card of cards) {
		      if (card.cardValue === 'A' && value > 10) {
		        card.cardWeight = 1;
		      }
		      value += card.cardWeight;
		    }
		    return value;
	  	}

			const calcTotal = () => {
		    playerValue = checkAce(playerCards, playerValue);
		    houseValue = checkAce(houseCards, houseValue);

	  	}

			const hit = () => {
		    if (!gameOver) {

		      let nextCard = deck.pop();

		      for (let card of playerCards) {
		        if (card.cardValue === 'A') {
		          if (nextCard.cardWeight + playerValue > 21) {
		            card.cardWeight = 1;
		          }
		        }
		      }

		      playerCards.push(nextCard);
					calcTotal();

		    } else {
		      return;
		    }
	  	}

			const stand = () => {

		    if (!gameOver) {
		      while (houseValue <= 17) {

		        let endDeck = deck.pop();
		        if (endDeck.cardValue === 'A' && houseValue > 10) {
		          endDeck.cardWeight = 1;
		        }
		        houseValue += endDeck.cardWeight;
		        houseCards.push(endDeck);
		      }

		    } else {
		      return;
		    }

	  	}

			const displayUI = () => {

				let playerUI = playerCards.map(card => {
					return `[\`${card.cardSuit + card.cardValue}\`](https://www.google.com/)`
				}).join(' ')

				let houseUI = houseCards.map(card => {
					return `[\`${card.cardSuit + card.cardValue}\`](https://www.google.com/)`
			  }).join(' ')

				bjEmbed.fields[0] = {name: `${message.author.username}`, value: `Cards: ${playerUI} \nTotal: ${playerValue}`, inline: true}
				bjEmbed.fields[1] = {name: `House`, value: `Cards: ${houseUI} \nTotal: ${houseValue}`, inline: true}
			}

			const checkWin = async () => {
				bjEmbed.setFooter(` `);
				if (!doubleDownOption) {
					bjEmbed.setDescription(`Your moves: \`hit\`, \`stand\`, or \`exit\` \nBet: \`${amount === 'all' ? profileData.wallet : amount}\` `)
				}
				if (doubleDown) {
					amount = amount * 2
				}

		    if (playerValue > 21) {
					gameOver = true;

					await profileModel.findOneAndUpdate({
	        	userID: message.author.id
	      	}, { $inc: {wallet: -amount, "bjStats.losses": +1} })

		      await bjEmbed.setDescription('Player bust, you lose!').setColor('#FF0000');
					await message.lineReply(`**You lost \`${amount}\` rupees! \nYou have: \`${profileData.wallet - parseInt(amount)}\` rupees left in your wallet**`);
					await bjEmbed.setFooter(`Wins: ${profileData.get('bjStats.wins')} || Losses: ${profileData.get('bjStats.losses') + 1}`);
		    } else if (houseValue > 21) {
					gameOver = true;

					await profileModel.findOneAndUpdate({
		        userID: message.author.id
		      }, { $inc: {wallet: amount, "bjStats.wins": +1} })

		     	await bjEmbed.setDescription('House bust, you win!').setColor('#00FF00');
				 	await message.lineReply(`**You won \`${amount}\` rupees! \nYou have: \`${profileData.wallet + parseInt(amount)}\` rupees left in your wallet**`);
					await bjEmbed.setFooter(`Wins: ${profileData.get('bjStats.wins') + 1} || Losses: ${profileData.get('bjStats.losses')}`);

		    } else if (playerValue > houseValue && houseCards.length > 1) {
					gameOver = true;

					await profileModel.findOneAndUpdate({
		        userID: message.author.id
		      }, { $inc: {wallet: amount, "bjStats.wins": +1} })

		      await bjEmbed.setDescription('You win!').setColor('#00FF00');
					await message.lineReply(`**You won \`${amount}\` rupees! \nYou have: \`${profileData.wallet + parseInt(amount)}\` rupees left in your wallet**`);
					await bjEmbed.setFooter(`Wins: ${profileData.get('bjStats.wins') + 1} || Losses: ${profileData.get('bjStats.losses')}`);

		    } else if (houseValue > playerValue && houseCards.length > 1) {
					gameOver = true;

					await profileModel.findOneAndUpdate({
	        	userID: message.author.id
	      	}, { $inc: {wallet: -amount, "bjStats.losses": +1} })

		      await bjEmbed.setDescription('You lose!').setColor('#FF0000');
					await message.lineReply(`**You lost \`${amount}\` rupees! \nYou have: \`${profileData.wallet - parseInt(amount)}\` rupees left in your wallet**`);
					await bjEmbed.setFooter(`Wins: ${profileData.get('bjStats.wins')} || Losses: ${profileData.get('bjStats.losses') + 1}`);

		    } else if (playerValue === houseValue && houseCards.length > 1) {
					gameOver = true;

		      await bjEmbed.setDescription('Push!').setColor('#FFFF00');
					await message.lineReply(`**You got back your \`${amount}\` rupees! \nYou have: \`${profileData.wallet}\` rupees left in your wallet**`);
					await bjEmbed.setFooter(`Wins: ${profileData.get('bjStats.wins')} || Losses: ${profileData.get('bjStats.losses')}`);
		    }


		  }

			const collectInput = () => {
				message.channel.send(bjEmbed).then(() => {
					message.channel.awaitMessages(m => m.author.id == message.author.id, {
						max: 1,
						time: 1000 * 15
					}).then(async collected => {
						const action = collected.first().content.toLowerCase();

						if (action.includes('hit') || action.startsWith('h')) {
							hit();
							doubleDownOption = false;
							displayUI();
							checkWin();
							if (gameOver == true) {
								return setTimeout(() => message.channel.send(bjEmbed), 500)
							}
							return collectInput()
						} else if (action.includes('stand') || action.startsWith('s')) {
							stand();
							displayUI();
							checkWin();

							if (gameOver == true) {
								return setTimeout(() => message.channel.send(bjEmbed), 500)
							}
						} else if (action.includes('exit') || action.startsWith('e')) {

							await profileModel.findOneAndUpdate({
				        userID: message.author.id
				      }, { $inc: {wallet: -amount} })

							return message.lineReply(
								flashEmbed.display('orange', `${message.author.username},`, `You ended the game!`)
							)
						} else if (doubleDownOption && (action.includes('double down') || action.startsWith('dd'))) {
							doubleDown = true;
							hit();
							displayUI();
							stand();
							displayUI();
							checkWin();
							if (gameOver == true) {
								return setTimeout(() => message.channel.send(bjEmbed), 500)
							}


						} else {

							await profileModel.findOneAndUpdate({
				        userID: message.author.id
				      }, { $inc: {wallet: -amount} })

							return message.lineReply(
								flashEmbed.display('red', `${message.author.username},`, `Please enter a valid response!`)
							)
						}

					}).catch(async () => {

						await profileModel.findOneAndUpdate({
			        userID: message.author.id
			      }, { $inc: {wallet: -amount} })
						return message.lineReply(
							flashEmbed.display('red', `${message.author.username},`, `You didn't answer in time!`)
						)
					})
				})
			}

			newGame();
			calcTotal();
			displayUI();
			if (!gameOver) {
				collectInput();
			}



		} catch (e) {
			console.log(e)
		}

  }
};
