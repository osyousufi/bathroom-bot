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

    let prize1 = 30
    let prize2 = 20
    let prize3 = 10

    let tableEmbed = new Discord.MessageEmbed()
      .setColor('DARK_NAVY')
      .setTitle(`ICON - MULTI`)
      .addFields(
        { name: `🍉🍉🍉 - ${prize3}x`, value: '\u200B' },
      	{ name: `🍇🍇🍇 - ${prize2}x`, value: '\u200B'},
      	{ name: `🍒🍒🍒 - ${prize1}x`, value: '\u200B'},
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

    const first = chance.integer({ min: 1, max: Object.keys(icons).length });
    const second = chance.integer({ min: 1, max: Object.keys(icons).length });
    const third = chance.integer({ min: 1, max: Object.keys(icons).length });


    let slotsArr = [first, second, third]
    let payout;

    if (arraysEqual(slotsArr, [3, 3, 3])) {
      payout = amount * prize1;
      multiplier = prize1;
    } else if (arraysEqual(slotsArr, [2, 2, 2])) {
      payout = amount * prize2;
      multiplier = prize2;
    } else if (arraysEqual(slotsArr, [1, 1, 1])) {
      payout = amount * prize3;
      multiplier = prize3;
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
