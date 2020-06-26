const Command = require('../../structures/commands');

module.exports = class autoUnflip extends Command {
  constructor(client) {
    super(client, {
      name: 'unflip',
      group: 'patterns',
      memberName: 'unflip',
      hidden: true,
      description: 'No table should be left unflipped.',
      patterns: [/\(╯°□°）╯︵ ┻━┻/i],
    });
  }

  async run(msg, args, fromPattern, something) {
    msg.channel.send('┬─┬ ノ( ゜-゜ノ)').catch(console.error);
  }
};
