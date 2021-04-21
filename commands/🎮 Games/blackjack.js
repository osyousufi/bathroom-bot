const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');

module.exports = {
	name: 'blackjack',
	guildOnly: true,
	usage: '<amount>',
	args: true,
	aliases: ['bj'],
	description: 'Blackjack (wip)',
	async execute(message, args, profileData, client, prefix) {

		const amount = args[0];

		try {

			if (amount % 1 !== 0 || amount <= 0) {
	      return message.lineReplyNoMention(
	        flashEmbed.display('#FF0000', `${message.author.username},`, `Amount must be a positive whole number! \nThe proper usage would be: \`${prefix}<@username> <amount>\``)
	      )
	    } else if (amount > profileData.rupees) {
	      return message.lineReplyNoMention(
	        flashEmbed.display('#FF0000', `${message.author.username},`, `You do not have that much money! broke mf lmAo`)
	      )
	    }

			const bjEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}'s Blackjack game:`)
			.setDescription(`hit, stand or surrender?`)

			let deck = [];
			let playerCards = [];
			let houseCards = [];
			let playerValue = 0;
			let houseValue = 0;
			let gameOver = false;

			const newGame = () => {
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


				playerCards.push(deck.pop());
				houseCards.push(deck.pop());
				playerCards.push(deck.pop());

				bjEmbed.addFields(
					{name: `${message.author.username}`, value: `Cards: ${playerCards} \nTotal: ${playerValue}`, inline: true},
					{name: `House`, value: `Cards: ${houseCards} \nTotal: ${houseValue}`, inline: true}
				)

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
					bjEmbed.fields[0] = {name: `${message.author.username}`, value: `Cards: ${playerCards} \nTotal: ${playerValue}`, inline: true}
					bjEmbed.fields[1] = {name: `House`, value: `Cards: ${houseCards} \nTotal: ${houseValue}`, inline: true}
					// message.edit(bjEmbed.set(field))(`${message.author.username}`, `Cards: ${playerCards} \nTotal: ${playerValue}`, true)
					// bjEmbed.setField(`House`, `Cards: ${houseCards} \nTotal: ${houseValue}`, true)
					// return message.channel.send(bjEmbed)

		    } else {
		      return;
		    }
	  	}

			const collectInput = () => {
				message.channel.send(bjEmbed).then(() => {
					message.channel.awaitMessages(m => m.author.id == message.author.id, {
						max: 1,
						time: 5000
					}).then(collected => {

						if (collected.first().content == 'hit') {
							message.channel.send('hitting')
							hit();
							return collectInput()
						}

					}).catch(() => {
						return message.channel.send('times up')
					})
				})


				// let counter = 0;
	      // const questions = [
	      //   `hit, stand or surrender?`
	      // ];
	      // const filter = m => m.author.id === message.author.id
	      // const collector = new Discord.MessageCollector(message.channel, filter, {
	      //   max: questions.length,
	      //   time: 1000 * 5
	      // });
				//
	      // message.channel.send(questions[counter++]);
				// message.channel.send(bjEmbed)
				//
				// collector.on('collect', m => {
	      //   if (counter < questions.length) {
	      //     m.channel.send(questions[counter++])
	      //   }
	      // });
				//
				// collector.on('end', mCollected => {
				//
				// 	if (mCollected.size < questions.length) {
				// 		return message.channel.send('ran out of time!')
				// 	}
				// 	const validResult = ['hit', 'stand', 'surrender'];
				// 	mCollected.forEach(async (value) => {
				// 		let response = value.content;
				// 		if (!validResult.includes(response)) {
	      //       return message.lineReplyNoMention(
	      //         flashEmbed.display('#FF0000', `${message.author.username},`, `Please enter a valid response!`)
	      //     	)
				// 		} else if (response == 'hit') {
				// 			message.channel.send('hitting')
				// 			hit();
				// 			collectInput();
				//
				// 		} else if (response == 'stand') {
				// 			message.channel.send('standing')
				// 			// stand();
				// 		} else {
				// 			message.channel.send('surrendered')
				// 			// surrender();
				// 		}
				// 	})
				// });
			}




			newGame();
			collectInput();

      // collector.on('end', mCollected => {
      //   // console.log(`collected ${mCollected.size} messages`);
      //   if (mCollected.size < questions.length) {
      //     return message.lineReplyNoMention (
      //       flashEmbed.display('#FF0000', `${message.author.username},`, `You did not answer in time!`)
      //     )
      //   }
			//
      //   // let counter = 0;
      //   const validResult = ['yes', 'no', 'y', 'n'];
      //   mCollected.forEach(async (value) => {
      //     // console.log(questions[counter++], value.content)
      //     let confirmResult = value.content;
      //     if (!validResult.includes(confirmResult)) {
      //       return message.lineReplyNoMention(
      //         flashEmbed.display('#FF0000', `${message.author.username},`, `Please enter a valid response!`)
      //       )
      //     } else if (confirmResult == 'yes' || confirmResult == 'y') {
			//
      //       await profileModel.findOneAndUpdate({
      //           userID: message.author.id
      //         }, { $inc: { rupees: -amount }});
			//
      //       await profileModel.findOneAndUpdate({
      //           userID: taggedUser.id
      //         }, { $inc: { rupees: +amount }});
			//
      //       return message.channel.send(
      //         flashEmbed.display('#00FF00', `${message.author.username},`, `Paid ${taggedUser.username} **\`${Number(amount).toString()}\`** rupees from your wallet!`)
      //       )
			//
      //     } else {
      //       message.lineReplyNoMention(
      //         flashEmbed.display('#FF0000', `${message.author.username},`, `Canceled payment.`)
      //       )
      //     }
			//
      //   });
			//
      // });



		} catch (e) {
			console.log(e)
		}

		// const [deck, setDeck] = useState([]);
	  // const [playerCards, setPlayerCards] = useState([]);
	  // const [houseCards, setHouseCards] = useState([]);
		//
	  // const [playerValue, setPlayerValue] = useState(0);
	  // const [houseValue, setHouseValue] = useState(0);
		//
	  // const [gameCondition, setGameCondition] = useState('');
	  // const [gameOver, setGameOver] = useState(false);

	  //Knuth Shuffle
	  // const shuffleDeck = (deckToShuffle) => {
	  //   let currentIndex = deckToShuffle.length;
	  //   let tempValue;
	  //   let randomIndex;
		//
	  //   while(0 !== currentIndex) {
	  //     randomIndex = Math.floor(Math.random() * currentIndex);
	  //     currentIndex -= 1;
		//
	  //     tempValue = deckToShuffle[currentIndex];
	  //     deckToShuffle[currentIndex] = deckToShuffle[randomIndex];
	  //     deckToShuffle[randomIndex] = tempValue;
	  //   }
		//
	  //   setDeck([...deckToShuffle]);
	  // }
		//
	  // const newGame = () => {
	  //   //generate 52 deck
	  //   const suits = ["♠", "♥", "♦", "♣"];
	  //   const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
	  //   let weight;
	  //   let color;
	  //   let tempDeck = [];
	  //   let tempPlayerCards = [];
	  //   let tempHouseCards = [];
		//
	  //   for (let suit of suits) {
	  //     for (let value of values) {
		//
	  //       if (value === 'J' || value === 'Q' || value === 'K') {
	  //         weight = 10;
	  //       } else if (value === 'A') {
	  //         weight = 11;
	  //       } else {
	  //         weight = parseInt(value);
	  //       }
		//
	  //       if (suit === '♥' || suit === '♦') {
	  //         color = "card-red"
	  //       } else {
	  //         color = "card-black"
	  //       }
		//
	  //       let card = {
	  //         cardValue: value,
	  //         cardSuit: suit,
	  //         cardWeight: weight,
	  //       }
		//
	  //       tempDeck.push(card);
	  //     }
	  //   }
		//
		//
	  //   shuffleDeck(tempDeck);
		//
	  //   //dealing cards
	  //   tempPlayerCards.push(tempDeck.pop());
	  //   tempHouseCards.push(tempDeck.pop());
	  //   tempPlayerCards.push(tempDeck.pop());
	  //   setDeck([...tempDeck]);
	  //   setPlayerCards([...tempPlayerCards]);
	  //   setHouseCards([...tempHouseCards]);
		//
	  // }
		//
	  // const checkAce = (cards, value) => {
		//
	  //   for (let card of cards) {
	  //     if (card.cardValue === 'A' && value > 10) {
	  //       card.cardWeight = 1;
	  //     }
	  //     value += card.cardWeight;
	  //   }
	  //   return value;
		//
	  // }
		//
	  // const calcTotal = () => {
		//
	  //   let tempHouseCards = houseCards;
	  //   let tempPlayerCards = playerCards;
	  //   let tempPlayerValue = 0;
	  //   let tempHouseValue = 0;
		//
	  //   setPlayerValue(checkAce(tempPlayerCards, tempPlayerValue));
	  //   setHouseValue(checkAce(tempHouseCards, tempHouseValue));
		//
	  // }
		//
	  // const hit = () => {
		//
	  //   if (!gameOver) {
	  //     let tempDeck = deck;
	  //     let tempPlayerCards = playerCards;
	  //     let tempPlayerValue = playerValue;
		//
	  //     let nextCard = tempDeck.pop();
		//
		//
	  //     for (let card of tempPlayerCards) {
	  //       if (card.cardValue === 'A') {
	  //         if (nextCard.cardWeight + tempPlayerValue > 21) {
	  //           card.cardWeight = 1;
	  //         }
	  //       }
	  //     }
		//
	  //     tempPlayerCards.push(nextCard);
		//
	  //     setDeck([...tempDeck]);
	  //     setPlayerCards([...tempPlayerCards]);
		//
	  //   } else {
	  //     return;
	  //   }
		//
	  // }
		//
	  // const stand = () => {
		//
	  //   if (!gameOver) {
	  //     let tempDeck = deck;
	  //     let tempHouseCards = houseCards;
	  //     let tempHouseValue = houseValue;
		//
		//
	  //     while (tempHouseValue <= 17) {
		//
	  //       let endDeck = tempDeck.pop();
	  //       if (endDeck.cardValue === 'A' && tempHouseValue > 10) {
	  //         endDeck.cardWeight = 1;
	  //       }
		//
	  //       tempHouseValue += endDeck.cardWeight;
	  //       tempHouseCards.push(endDeck);
		//
	  //     }
		//
	  //     setDeck([...tempDeck]);
	  //     setHouseCards([...tempHouseCards]);
	  //     setHouseValue(tempHouseValue);
		//
	  //   } else {
	  //     return;
	  //   }
		//
	  // }
		//
		//
	  // const checkWin = () => {
		//
	  //   if (playerValue > 21) {
	  //     setGameCondition('Player bust, you lose!');
	  //     setGameOver(true);
	  //   } else if (houseValue > 21) {
	  //     setGameCondition('House bust, you win!');
	  //     setGameOver(true);
	  //   } else if (playerValue > houseValue && houseCards.length > 1) {
	  //     setGameCondition('You win!');
	  //     setGameOver(true);
	  //   } else if (houseValue > playerValue && houseCards.length > 1) {
	  //     setGameCondition('You lose!');
	  //     setGameOver(true);
	  //   } else if (playerValue === houseValue && houseCards.length > 1) {
	  //     setGameCondition('Push!');
	  //     setGameOver(true);
	  //   } else {
	  //     setGameCondition('');
	  //     setGameOver(false);
	  //   }
		//
	  // }
  }
};
