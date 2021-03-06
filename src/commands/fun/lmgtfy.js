const Command = require('../../structures/commands');

module.exports = class lmgtfy extends Command {
  constructor(client) {
    super(client, {
      name: 'lmgtfy',
      aliases: [
        'google-that',
      ],
      group: 'fun',
      memberName: 'lmgtfy',
      description: 'Creates a let me google that for you link.',
      details: '',
      examples: [
        'lmgtfy Which discord bot is the best?',
      ],
      args: [
        {
          key: 'text',
          label: 'text',
          prompt: 'What would you like to be googled?',
          type: 'string',
        },
      ],
      guildOnly: false,
    });
  }

  async run(msg, { text }, fromPattern, something) {
    return msg.reply(`https://lmgtfy.com/?q=${text.split(' ').join('+')}`);
  }
};
