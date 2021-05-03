const Discord = require('discord.js');
const flashEmbed = require('../../utility/flash-embed.js');
const profileModel = require('../../models/profileSchema');
const chance = new (require('chance'))();

module.exports = {
  name: "slots",
  args: true,
  usage: '[amount, table(optional)]',
  description: "Play a game of slots.",
  async execute(message, args, profileData, client, prefix) {

    let amount = args[0];
    const maxBet = 1000;
    let win = true;
    let multiplier;

    let slotEmbed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle(`${message.author.username}'s slot machine:`)


    let tableEmbed = new Discord.MessageEmbed()
      .setColor('DARK_NAVY')
      .setTitle(`ICON - MULTI`)
      .addFields(
        { name: '🍉🍉🍉 - 5x', value: '\u200B' },
      	{ name: '🍇🍇🍇 - 10x', value: '\u200B'},
      	{ name: '🍒🍒🍒 - 25x', value: '\u200B'},

      )

    const icons = {
      1: '🍉',
      2: '🍇',
      3: '🍒',
    }

    if(amount.toLowerCase() == 'table') {
      return message.channel.send(tableEmbed)
    }
    if(amount.toLowerCase() == 'all') {

      if (profileData.wallet <= 0) {
        return message.lineReply(
          flashEmbed.display('#FF0000', `${message.author.username},`, `No money in your wallet! broke mf!! LOL`)
        )
      }

      if(profileData.wallet > maxBet) {
	        amount  = maxBet
      } else {
        amount = profileData.wallet
      }

    } else if (amount % 1 !== 0 || amount < 10) {
      return message.lineReply(
        flashEmbed.display('#FF0000', `${message.author.username},`, `Bet amount must be at least 10 rupees! \nThe proper usage would be: \`${prefix}slots <amount>\``)
      )
    } else if (amount > profileData.wallet) {
      return message.lineReply(
        flashEmbed.display('#FF0000', `${message.author.username},`, `You do not have that much money!`)
      )
    } else if (amount > maxBet) {
      return message.lineReply(
        flashEmbed.display('#FF0000', `${message.author.username},`, `Bet amount must be less than \`${maxBet}\` rupees!`)
      )
    } else {
      amount = parseInt(amount)
    }

    function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
      return JSON.stringify(a1)==JSON.stringify(a2);
    }

    const first = chance.integer({ min: 1, max: 3});
    const second = chance.integer({ min: 1, max: 3});
    const third = chance.integer({ min: 1, max: 3});

    let slotsArr = [first, second, third]
    let payout;

    if (arraysEqual(slotsArr, [3, 3, 3])) {
      payout = amount * 25;
      multiplier = 25
    } else if (arraysEqual(slotsArr, [2, 2, 2])) {
      payout = amount * 10;
      multiplier = 10
    } else if (arraysEqual(slotsArr, [1, 1, 1])) {
      payout = amount * 5;
      multiplier = 5
    } else {
      win = false;
    }

    if (win) {

      await profileModel.findOneAndUpdate({
        userID: message.author.id
      }, { $inc: {wallet: payout} });
      slotEmbed.addField(`Multiplier - \`x${multiplier}\``, `**You won** \`${payout}\` rupees! \n You have \`${profileData.wallet + payout}\` rupees left.`)

    } else {

      await profileModel.findOneAndUpdate({
        userID: message.author.id
      }, { $inc: {wallet: -amount} });

      slotEmbed
        .addField(`Multiplier - \`NONE\``, `**You lost** \`${amount}\` rupees! \n You have \`${profileData.wallet - amount}\` rupees left.`)
        .setColor('RED')
    }


    slotEmbed.setDescription(`**>${icons[first]} ${icons[second]} ${icons[third]}<**`)
    return message.lineReply(slotEmbed)


  }
}
