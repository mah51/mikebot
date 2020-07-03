const Command = require('../../structures/commands');

module.exports = class FactCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'fact',
      aliases: [
        'random-fact',
        'r-f',
      ],
      group: 'fun',
      memberName: 'fact',
      fullName: 'Random Fact',
      description: 'Get\'s a random fact from cat facts to useless trivia!',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'type',
          label: 'type',
          prompt: 'Type a specific trivia, choose from `cat`, `dog`, `useless`',
          type: 'string',
          validate: (query) => ['cat', 'dog', 'useless'].includes(query.toLowerCase()),
          error: 'That type was invalid try any of: `cat`, `dog`, `useless`',
        },
      ],
      guildOnly: false,
    });
  }

  async run(msg, args, fromPattern, something) {

  }
};
