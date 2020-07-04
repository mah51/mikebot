const Command = require('../../structures/commands');

module.exports = class LetterEmCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emoji-convert',
      aliases: ['emoji', 'convert-e'],
      group: 'text',
      memberName: 'emoji-convert',
      description: 'Converts a provided message into emoji letters.',
      examples: ['letter-em this about to be a BIG boi.'],
      args: [
        {
          key: 'text',
          prompt: 'Provide some text to be converted!',
          type: 'string',
        },
      ],
    });
  }

  async run(msg, { text }, fromPattern, something) {
    let emojiLetter;
    const numbers = {
      1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
    };
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    const numberKeys = Object.keys(numbers);

    const string = text.toLowerCase();

    let letter;
    let emojiString = '';
    for (let i = 0; i < string.length; i += 1) {
      letter = string[i];
      if (alphabet.includes(letter) === true) {
        if (letter !== 'b') {
          emojiLetter = `:regional_indicator_${letter}:   `;
        } else {
          emojiLetter = ':b:   ';
        }
        emojiString += emojiLetter;
      } else if (numberKeys.includes(letter) === true) {
        const numString = numbers[letter];
        emojiLetter = `:${numString}: `;
        emojiString += emojiLetter;
      } else if (letter === ' ') {
        emojiString += '      ';
      } else {
        emojiString += letter;
      }
    }
    return msg.reply(`\n${emojiString}`).catch(console.error);
  }
};
