const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const { verify } = require('../../functions/commandFunctions/util');

module.exports = class TicTacToeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tic-tac-toe',
      aliases: [
        't-t-t',
      ],
      group: 'games',
      memberName: 'tic-tac-toe',
      description: 'Initiate a game of tic tac toe with a user.',
      guildOnly: true,
      args: [
        {
          key: 'versus',
          prompt: 'Who would you like to play with?',
          type: 'user',
        },
        {
          key: 'bet',
          label: 'bet',
          prompt: 'Would you like to add a bet to the game?',
          type: 'integer',
          validate: (query) => query > 0,
          default: 0,
        },
      ],
    });
  }

  async run(msg, { versus, bet }, fromPattern, result) {
    if (versus.bot) return this.makeError(msg, '🤖 Bot detected... 🤖, choose a human! *loner*');
    if (versus.id === msg.author.id) return this.makeError(msg, 'Get some friends 😎 (insert oof), you can\'t play against yourself');
    const current = this.client.games.get(msg.channel.id);
    if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
    this.client.games.set(msg.channel.id, { name: this.name, players: [msg.author.username, versus.username] });
    try {
      await msg.say(`${versus}, you have been invited to a game of tic tac toe! There is $${bet} at stake!\nReply with yes to play.`);
      const verification = await verify(msg.channel, versus);
      if (!verification) {
        this.client.games.delete(msg.channel.id);
        return msg.say('Ouch that\'s gotta hurt... maybe next time 😶');
      }
      const sides = [' 1 ', ' 2 ', ' 3 ', ' 4 ', ' 5 ', ' 6 ', ' 7 ', ' 8 ', ' 9 '];
      const taken = [];
      let userTurn = true;
      let winner = null;
      let lastTurnTimeout = false;
      while (!winner && taken.length < 9) {
        const user = userTurn ? msg.author : versus;
        const sign = userTurn ? '❌' : '⭕';
        await msg.say(`Which position would you like to pick ${user}, type the number corresponding to the square or \`ff\` to forfeit!`, {
          embed: {
            footer: `Now playing: ${user}`,
            color: this.client.setting.colour,
            author: {
              name: `${user.username}'s turn!`,
              icon: user.displayAvatarURL(),
            },
            description: `
\`\`\`
 ${sides[0]}  |  ${sides[1]}  |  ${sides[2]} 
————————————————————
 ${sides[3]}  |  ${sides[4]}  |  ${sides[5]} 
————————————————————
 ${sides[6]}  |  ${sides[7]}  |  ${sides[8]} 
\`\`\`
`,
          },
        }).catch(console.error);
        const filter = (res) => {
          if (res.author.id !== user.id) return false;
          const choice = res.content;
          if (choice.toLowerCase() === 'ff') return true;
          return sides.includes(` ${choice} `) && !taken.includes(` ${choice} `);
        };
        const turn = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: 30000,
        });
        if (!turn.size) {
          await msg.say('You took too long, and your go was skipped! 😢');
          if (lastTurnTimeout) {
            winner = 'time';
            break;
          } else {
            userTurn = !userTurn;
            lastTurnTimeout = true;
            continue;
          }
        }
        const choice = turn.first().content;
        if (choice.toLowerCase() === 'ff') {
          winner = userTurn ? versus : msg.author;
          break;
        }
        sides[Number.parseInt(choice, 10) - 1] = sign;
        taken.push(choice);
        if (this.verifyWin(sides)) winner = userTurn ? msg.author : versus;
        if (lastTurnTimeout) lastTurnTimeout = false;
        userTurn = !userTurn;
      }
      this.client.games.delete(msg.channel.id);
      if (winner === 'time') return msg.say('Hello... is anyone here? I cancelled the game because of inactivity 😅');
      if (winner && bet > 0) {
        const userInfo = await this.client.findMember({ id: msg.author.id, guildID: msg.guild.id });
        const versusInfo = await this.client.findMember({ id: versus.id, guildID: msg.guild.id });
        if (winner.id === msg.author.id) {
          userInfo.balance += bet;
          versusInfo.balance -= bet;
          await userInfo.save();
          await versusInfo.save();
        } else if (winner.id === versus.id) {
          userInfo.balance -= bet;
          versusInfo.balance += bet;
          await userInfo.save();
          await versusInfo.save();
        }
      }
      return msg.say(`${winner ? `${winner} won!${bet > 0 ? ` and received $${bet} 🤑` : ''}` : 'A draw!'}\n${winner ? 'https://tenor.com/view/argument-heated-when-win-gif-4519334' : 'https://tenor.com/view/perfectly-balanced-infinity-war-thanos-balance-all-things-should-be-balanced-gif-16273067'}`);
    } catch (err) {
      this.client.games.delete(msg.channel.id);
      throw err;
    }
  }

  verifyWin(sides) {
    return (sides[0] === sides[1] && sides[0] === sides[2])
      || (sides[0] === sides[3] && sides[0] === sides[6])
      || (sides[3] === sides[4] && sides[3] === sides[5])
      || (sides[1] === sides[4] && sides[1] === sides[7])
      || (sides[6] === sides[7] && sides[6] === sides[8])
      || (sides[2] === sides[5] && sides[2] === sides[8])
      || (sides[0] === sides[4] && sides[0] === sides[8])
      || (sides[2] === sides[4] && sides[2] === sides[6]);
  }
};
