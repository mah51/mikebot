const { MessageEmbed } = require('discord.js');
const { SlotMachine, SlotSymbol } = require('slot-machine');
const Command = require('../../structures/commands');

const symbols = [
  new SlotSymbol('1', {
    display: '🍒',
    points: 1,
    weight: 100,
  }),
  new SlotSymbol('2', {
    display: '🍋',
    points: 1,
    weight: 100,
  }),
  new SlotSymbol('3', {
    display: '🍇',
    points: 1,
    weight: 100,
  }),
  new SlotSymbol('3', {
    display: '🍍',
    points: 1,
    weight: 100,
  }),
  new SlotSymbol('4', {
    display: '🍓',
    points: 1,
    weight: 100,
  }),
  new SlotSymbol('5', {
    display: '🍉',
    points: 1,
    weight: 100,
  }),
  new SlotSymbol('6', {
    display: '🍊',
    points: 1,
    weight: 100,
  }),
  new SlotSymbol('a', {
    display: '💵',
    points: 5,
    weight: 60,
  }),
  new SlotSymbol('b', {
    display: '💰',
    points: 10,
    weight: 40,
  }),
  new SlotSymbol('c', {
    display: '⚜',
    points: '100',
    weight: 20,
  }),
  new SlotSymbol('c', {
    display: '💎',
    points: 200,
    weight: 5,
  }),
  new SlotSymbol('w', {
    display: '🃏',
    points: 1,
    weight: 40,
    wildcard: true,
  }),
];

module.exports = class SlotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'slots',
      aliases: [
        'slot-machine',
        'slot',
      ],
      group: 'games',
      memberName: 'slot',
      fullName: 'Slots Machine',
      description: 'Gamble your currency on the slot machine',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'option',
          label: 'option',
          prompt: 'How much would you like to play for in $',
          type: 'integer|string',
          validate: (query) => !isNaN(query) || query === 'list',
          error: 'That value was not valid, to see a list of payouts do `.slot-machine list` or to play a game do `.slot-machine <amount in $>`',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { option }, fromPattern, something) {
    if (option === 'list') {
      const embed = new MessageEmbed()
        .setFooter(this.client.setting.footer)
        .setColor(this.client.setting.colour)
        .setTitle('`🎰` Payout Table `🎰`')
        .setDescription(symbols.map((s) => `${s.display}\u2000\`→\`\u2000**$${s.points.toLocaleString()}**`));

      return msg.channel.send({ embed });
    }

    const userInfo = await this.client.findMember({ id: msg.author.id, guildID: msg.guild.id });
    if (userInfo.balance < option || !userInfo) {
      return this.makeError(msg, 'You do not have enough `$💵` to play!');
    }

    const machine = new SlotMachine(3, symbols);
    const results = machine.play();

    const embed = new MessageEmbed();
    const dollarSigns = '   ➖ ➖ ➖  ';

    embed.description = (results.lines.slice(-2)[0].isWon ? '\n↘' : '\n⬛')
      + dollarSigns
      + (results.lines.slice(-1)[0].isWon ? '↙' : '⬛');

    for (let i = 0; i < results.lines.length - 2; i++) {
      embed.description += (results.lines[i].isWon ? '\n➡   ' : '\n⬛   ')
        + results.lines[i].symbols.map((s) => s.display).join(' ')
        + (results.lines[i].isWon ? '   ⬅' : '   ⬛');
    }

    embed.description += (results.lines.slice(-1)[0].isWon ? '\n↗' : '\n⬛')
      + dollarSigns
      + (results.lines.slice(-2)[0].isWon ? '↖' : '⬛');

    const points = results.lines.reduce((total, line) => total + line.points, 0);
    const payout = option * points;

    embed.addField(
      points ? 'You won, nice one!' : 'You lost 😢',
      points ? `You have earned \`$${payout.toLocaleString()} 💵\`` : 'Maybe next time...',
    )
      .setColor(this.client.setting.colour)
      .setFooter(this.client.setting.footer)
      .setTimestamp()
      .setAuthor(`${msg.member.displayName} ${points ? 'won!' : 'lost!'}`, msg.author.displayAvatarURL());
    userInfo.balance = userInfo.balance - option + payout;
    await userInfo.save();
    return msg.say({ embed });
  }
};
