const { emojify } = require('emojify-lyrics');
const Command = require('../../structures/commands');

module.exports = class EmojifyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emojify',
      aliases: [

      ],
      group: 'text',
      memberName: 'emojify',
      fullName: 'Emojify Command',
      description: 'Supplement your text with emojis :)',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'text',
          label: 'text',
          prompt: 'What text would you like to convert?',
          type: 'string',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, result) {
    const { text } = args;
    try {
      const returntext = emojify(text);
      await msg.reply(returntext.length > 2000 ? 'response is over 2000 characters :(' : returntext);
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
