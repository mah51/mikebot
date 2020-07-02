const Command = require('../../structures/commands');

module.exports = class autoUnflip extends Command {
  constructor(client) {
    super(client, {
      name: 'rude',
      group: 'patterns',
      memberName: 'rude',
      hidden: true,
      description: 'Do you kiss your mother with that mouth?',
      patterns: [/(kys)/],
    });
  }

  async run(msg, args, fromPattern, something) {
    msg.channel.send(`${msg.author}, do you kiss your mother with that mouth?`).catch(console.error);
  }
};
