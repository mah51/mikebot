const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');
const { verify } = require('../../util/util');

module.exports = class CoinFlipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coin-flip',
      aliases: [
        'c-f',
      ],
      group: 'games',
      memberName: 'coin-flip',
      fullName: 'Coin Flip',
      description: 'Flip a coin, and bet money if you want.',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'bet',
          label: 'bet',
          prompt: 'How much money would you like to bet?',
          type: 'integer',
          validate: (query) => query >= 0,
        },
        {
          key: 'member',
          label: 'member',
          prompt: 'Would you like to play with a member?',
          type: 'member',
          default: '',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { member, bet }, fromPattern, something) {
    const current = this.client.games.get(msg.channel.id);
    if (current) return msg.reply(`Please wait until the current game of \`${current.name}\` is finished.`);
    try {
      const memberInfo = await this.client.findMember({ id: member.id, guildID: msg.guild.id });
      const authorInfo = await this.client.findMember({ id: msg.member.id, guildID: msg.guild.id });
      if (authorInfo.balance < bet) { return this.makeError(msg, 'You don\'t have that much money!'); }
      if (member) {
        if (member.bot) return this.makeError(msg, '🤖 Bot detected... 🤖, choose a human! *loner*');
        if (member.id === msg.author.id) return this.makeError(msg, 'Get some friends 😎 (insert oof), you can\'t play against yourself');
        this.client.games.set(msg.channel.id, { name: this.name, players: [msg.author.username, member.user.username] });
        if (memberInfo.balance < bet) { return this.makeError(msg, `${member.displayName} doesn't have that much money to bet!`); }
        await msg.say(`${member}, you have been invited to a game of tic tac toe! There is $${bet} at stake!\nReply with yes to play.`);
        const verification = await verify(msg.channel, member);
        if (!verification) {
          this.client.games.delete(msg.channel.id);
          return msg.say('That member didn\'t want to play, try someone that\'s more fun! 😶');
        }
      }
      const authorWin = Math.random() > 0.5;

      if (member) {
        memberInfo.balance += authorWin ? bet * -1 : bet;
        await memberInfo.save();
      }

      authorInfo.balance += authorWin ? bet : bet * -1;
      await authorInfo.save();
      const embed = new MessageEmbed()
        .setFooter(this.client.setting.footer)
        .setColor(this.client.setting.colour)
        .setTimestamp()
        // eslint-disable-next-line no-nested-ternary
        .setAuthor(authorWin ? 'Winner!' : member ? 'Winner!' : 'Loser!', (member && !authorWin ? member.user.displayAvatarURL() : msg.author.displayAvatarURL()))
        .setDescription(`${authorWin ? `${msg.member} won!` : ` ${member ? `${member} won!` : `${msg.member.displayName} flipped heads and got tails :/`}`} ${authorWin ? `${msg.member.displayName} earned $${bet}${member ? `To ${member.displayName}'s disappointment!` : ''}!` : ` ${msg.member.displayName} was fined $${bet}${member ? `, by ${member.displayName}` : ''}!`}`);
      this.client.games.delete(msg.channel.id);
      return msg.say(embed);
    } catch (err) {
      this.client.games.delete(msg.channel.id);
      console.error(err);
    }
  }
};
