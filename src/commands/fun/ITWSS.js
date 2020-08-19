const Command = require('../../structures/commands');

module.exports = class ITWSSCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'itwss',
      aliases: [
        'twss',
      ],
      group: 'fun',
      memberName: 'itwss',
      fullName: 'Is That What She Said Command',
      description: 'Determines if supplied phrase is what she said xd.',
      details: '',
      examples: [
        'itwss that was hard',
      ],
      args: [
        {
          key: 'phrase',
          label: 'phrase',
          prompt: 'Enter a phrase to test if it is what she said',
          type: 'string',
        },
      ],
      guildOnly: false,
    });
  }

  async run(msg, args, fromPattern, result) {
    try {
      await this.client.provider.set(msg.guild.id, 'twss-enabled', true);
      await msg.reply('twss activated');
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
