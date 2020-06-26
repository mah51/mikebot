
const Command = require('../../structures/commands');

module.exports = class replaceAllBs extends Command {
  constructor(client) {
    super(client, {
      name: 'b-replace',
      aliases: ['replace-b', 'big-b'],
      group: 'text',
      memberName: 'b-replace',
      description: "Replaces all b's in a string to the B emoji.",
      examples: ['replace-b buss a nut'],

      args: [
        {
          key: 'text',
          prompt: "Supply text to replace with B's.",
          type: 'string',
        },
      ],

    });
  }

  async run(msg, { text }, fromPattern, something) {
    const string = text.toLowerCase();

    let reply = '';
    let letter;
    let emojiString = '';
    for (let i = 0; i < string.length; i += 1) {
      letter = string[i];
      if (letter === 'b') {
        const bEmoji = ':b:';
        emojiString += bEmoji;
      } else {
        emojiString += letter;
      }
    }
    reply = emojiString;

    return msg.reply(`\n${reply}`).catch(console.error);
  }
};
