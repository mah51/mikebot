const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const { shuffle, verify } = require('../../util/util');

module.exports = class RussianRouletteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'russian-roulette',
      aliases: ['r-r'],
      group: 'games',
      fullName: 'Russian Roulette',
      memberName: 'russian-roulette',
      description: 'Who will pull the trigger and die first?',
      guildOnly: true,
      args: [
        {
          key: 'opponent',
          prompt: 'Who would you like to play against?',
          type: 'user',
          default: () => this.client.user,
        },
        {
          key: 'bet',
          label: 'bet',
          prompt: 'Would you like to add a bet to the game?',
          type: 'integer',
          validate: (query) => query > -1,
          default: 0,
        },
      ],
    });
  }

  async run(msg, { opponent, bet }, fromPattern, result) {
    if (opponent.id === msg.author.id) return this.makeError(msg, 'Hmm... That could only end badly. Try choosing someone that isn\'t yourself! 😯');
    const current = this.client.games.get(msg.channel.id);
    if (current) return this.makeError(msg, `There is already a game of \`${current.name}\` is being played in this channel!`);
    const userInfo = await this.client.findMember({ id: msg.author.id, guildID: msg.guild.id });
    this.client.games.set(msg.channel.id, { name: this.name, players: [msg.author.username, opponent.username] });
    if (userInfo.balance - bet < 0) { return this.makeError(msg, 'You don\'t have that much money!'); }
    try {
      if (opponent.bot && bet > 0) {
        this.makeError(msg, 'You can\'t make a bet with a bot');
        return this.client.games.delete(msg.channel.id);
      }
      let versusInfo;
      if (!opponent.bot) {
        versusInfo = await this.client.findMember({ id: opponent.id, guildID: msg.guild.id });
        if (versusInfo.balance - bet < 0) { return this.makeError(msg, `${opponent} does not have enough money!`); }
        await msg.say(`${opponent}, you have been invited to a game of russian roulette! There is $${bet} at stake!\nReply with yes to play.`);
        const verification = await verify(msg.channel, opponent);
        if (!verification) {
          this.client.games.delete(msg.channel.id);
          return msg.say('They didn\'t accept 😪');
        }
      }
      let userTurn = true;
      const gun = shuffle([true, false, false, false, false, false, false, false]);
      let round = 0;
      let winner = null;
      let quit = false;
      while (!winner) {
        const player = userTurn ? msg.author : opponent;
        const notPlayer = userTurn ? opponent : msg.author;
        if (gun[round]) {
          await msg.say(`${player} 🎯 🔫 got unlucky... And Died ☠`);
          winner = notPlayer;
        } else {
          const embed = new MessageEmbed()
            .setFooter(this.client.setting.footer)
            .setColor(this.client.setting.colour)
            .setTimestamp()
            .setDescription(`${player} pulled the trigger and survived to no ones relief! 🥱\n${opponent.bot ? 'Continue?' : `Do you want to risk your life, ${notPlayer}? (reply with yes to continue)`} (${8 - round - 1} shots left)`);
          await msg.say(embed);
          const keepGoing = await verify(msg.channel, opponent.bot ? msg.author : notPlayer);
          if (!keepGoing) {
            if (opponent.bot) winner = opponent;
            else winner = player;
            quit = true;
          }
          round += 1;
          userTurn = !userTurn;
        }
      }
      this.client.games.delete(msg.channel.id);
      if (bet > 0 && opponent) {
        if (winner.id === msg.author.id) {
          versusInfo.balance -= bet;
          userInfo.balance += bet;
          await versusInfo.save();
          await userInfo.save();
        } else if (winner.id === opponent.id) {
          versusInfo.balance += bet;
          userInfo.balance -= bet;
          await versusInfo.save();
          await userInfo.save();
        }
      }
      if (quit) return msg.say(`${winner} wins, ${opponent.username} chickened out! 🐔.`);
      return msg.say(`The winner is ${winner}!`);
    } catch (err) {
      this.client.games.delete(msg.channel.id);
      throw err;
    }
  }
};
