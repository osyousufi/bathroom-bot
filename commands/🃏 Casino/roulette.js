const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require('../../models/profileSchema');
const chance = new (require('chance'))();

module.exports = {
  name: "roulette",
  args: true,
  usage: '<amount> <space>',
  aliases: ['rl'],
  description: "Play a game of roulette.",
  async execute(message, args, profileData, client, prefix) {

    let amount = args[0];
    let space = args.slice(1).join(' ');



    const validSpaces =  [
      'red',
      'black',
      'odd',
      'even',
      '1st',
      '2nd',
      '3rd',
      '1-12',
      '13-24',
      '25-36',
      '0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36'
    ]

    const spaceToNumbers = {
      'red': [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
      'black': [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
      'odd': [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
      'even': [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
      '1st': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      '1-12': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      '2nd': [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      '13-24': [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      '3rd': [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
      '25-36': [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    }

    const result = chance.integer({min: 0, max: 36});
    // const result = 1;

    const rlEmbed = new Discord.MessageEmbed()
      .setTitle(`${message.author.username}'s roulette game:`)
      .setDescription(`Ball landed on ${result}`)

    let gameWon;

    if (result == 0) {
      rlEmbed.setColor('GREEN');
    } else if (Object.values(spaceToNumbers['red']).indexOf(result) !== -1) {
      rlEmbed.setColor('RED');
    } else if (Object.values(spaceToNumbers['black']).indexOf(result) !== -1) {
      rlEmbed.setColor('BLACK');
    }

    if(amount.toLowerCase() == 'all') {

      if (profileData.wallet <= 0) {
        return message.lineReply(
          flashEmbed.display('#FF0000', `${message.author.username},`, `No money in your wallet! broke mf!! LOL`)
        )
      }
      amount = profileData.wallet

    } else if (amount % 1 !== 0 || amount < 10) {
      return message.lineReply(
        flashEmbed.display('#FF0000', `${message.author.username},`, `Bet amount must be at least 10 rupees! \nThe proper usage would be: \`${prefix}roulette <amount> <space>\``)
      )
    } else if (amount > profileData.wallet) {
      return message.lineReply(
        flashEmbed.display('#FF0000', `${message.author.username},`, `You do not have that much money!`)
      )
    } else if (amount > 250000) {
      return message.lineReply(
        flashEmbed.display('#FF0000', `${message.author.username},`, `Bet amount must be less than 250000 rupees!`)
      )
    } else {
      amount = parseInt(amount)
    }


    if ( validSpaces.indexOf(`${space}`) == -1 ) {
      return message.lineReply(
        flashEmbed.display('#FF0000', `${message.author.username},`, `Please enter a valid space! \n\`${prefix}roulette <amount> <space>\`\n\n**Options:**\n\`0-36\`, \`red\`, \`black\`, \`odd\`, \`even\`, \`1-12\`, \`13-24\`, or \`25-36\``)
      )
    }

    const rollEmbed = new Discord.MessageEmbed()
      .setColor('ORANGE')
      .setTitle(`${message.author.username},`)
      .setDescription(`Ball is rolling... \n\nBet: \`${amount}\``)
      .setFooter(`Wins: ${profileData.get('rlStats.wins')} || Losses: ${profileData.get('rlStats.losses')}`);

    message.channel.send(
      rollEmbed
    )


    const checkValue = (objectSection) => {
      return Object.values(spaceToNumbers[objectSection]).indexOf(result) !== -1
    }


    let winnings = amount;


    if (result == parseInt(/^{space}$/)) {

      winnings = amount + (amount * 35);
      gameWon = true;
      await profileModel.findOneAndUpdate({
        userID: message.author.id
      }, { $inc: {wallet: winnings, "rlStats.wins": +1} })

    } else if (Object.keys(spaceToNumbers).indexOf(space) !== -1) {
      if (spaceToNumbers[space].indexOf(result) !== -1) {
        if (checkValue('red') || checkValue('black') || checkValue('even') || checkValue('odd')) {
          winnings = amount + (amount);

          gameWon = true;

          await profileModel.findOneAndUpdate({
            userID: message.author.id
          }, { $inc: {wallet: winnings, "rlStats.wins": +1} });

        } else if (checkValue('1st') || checkValue('2nd') || checkValue('3rd') || checkValue('1-12') ||resultKey == checkValue('13-24') || checkValue('25-36')) {

          winnings = amount + (amount*2);

          gameWon = true;

          await profileModel.findOneAndUpdate({
            userID: message.author.id
          }, { $inc: {wallet: winnings, "rlStats.wins": +1} });
        }

      } else {

        gameWon = false;

        await profileModel.findOneAndUpdate({
          userID: message.author.id
        }, { $inc: {wallet: -winnings, "rlStats.losses": +1} });


      }

    }

    if (gameWon) {
      rlEmbed.setFooter(`Wins: ${profileData.get('rlStats.wins') + 1} || Losses: ${profileData.get('rlStats.losses')}`);
      rlEmbed.addField(`You ***won*** \`${winnings}\` rupees!`, `You have \`${profileData.wallet + winnings}\` rupees left in your wallet!`);
    } else {
      rlEmbed.setFooter(`Wins: ${profileData.get('rlStats.wins')} || Losses: ${profileData.get('rlStats.losses') + 1}`);
      rlEmbed.addField(`You ***lost*** \`${winnings}\` rupees!`, `You have \`${profileData.wallet - winnings}\` rupees left in your wallet!`);
    }

    setTimeout(() => {
      gameWon ? message.lineReply('***YOU WIN!***') : message.lineReply('***YOU LOSE!***')
      message.channel.send(rlEmbed)
    }, 2500)

  }
}
