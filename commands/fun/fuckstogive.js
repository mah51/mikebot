const Command = require('../../structures/commands');

module.exports = class FucksGiven extends Command {
  constructor(client) {
    super(client, {
      name: 'fucks-given',
      aliases: [
        'fg',
      ],
      group: 'fun',
      memberName: 'fucks-given',
      description: 'The bot tells you how many fucks it gives',
      details: '',
      examples: [

      ],
      args: [

      ],
      throttling: {
        usages: 1,
        duration: 60,
      },
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const options = [
      '🛏 Looking under the mattress... only found a spooky boi down there 🛏',
      '🌚 Checking on the dark side of the moon... 🌚',
      '🚀 Scouting on Mars 🚀',
      '🏔 Exploring mount everest 🏔',
      '🌌 Searching other dimensions 🌌',
      '🕳 Dipping into a black hole real quick 🕳',
    ];
    const random = Math.floor(Math.random() * options.length);
    return msg.channel.send(options[random])
      .then(async (message) => {
        await setTimeout(() => {
          clearInterval();
          message.edit(Math.random() > 0.95 ? '🚢 Woah no way, just found a whole boatload of fucks 🚢' : '😎 Couldn\'t find any... get a life 😎').catch(console.error);
        }, 3000);
      });
  }
};
