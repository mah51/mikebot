const axios = require('axios');
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
          default: null,
          type: 'string',
          validate: (query) => ['cat', 'dog', 'useless'].includes(query.toLowerCase()),
          error: 'That type was invalid try any of: `cat`, `dog`, `useless`',
        },
      ],
      guildOnly: false,
    });
  }

  async run(msg, { type }, fromPattern, something) {
    const apis = [
      'https://catfact.ninja/fact',
      'https://dog-api.kinduff.com/api/facts',
      'https://useless-facts.sameerkumar.website/api',
    ];

    // Fetches the facts
    const apinames = ['cat', 'dog', 'useless'];
    const apilabels = ['🐱 Cat Fact', '🐶 Dog Fact', '🍀 Useless Fact'];
    let index = Math.floor(Math.random() * apis.length);

    if (type) {
      index = apinames.indexOf(apinames.filter((api) => api.includes(type.toLowerCase()))[0]);
    }

    if (index === -1) { return this.makeError(msg, 'Could not find that type of fact :('); }

    const api = apis[index];
    const apiname = apinames[index];
    const apilabel = apilabels[index];
    let fact;

    // Sends the fact
    const { data } = await axios.get(api);
    const body = data;
    if (!body) return this.makeError(msg, 'There was an error sending the fact :(');
    if (apiname === 'cat') fact = body.fact;
    // eslint-disable-next-line prefer-destructuring
    else if (apiname === 'dog') fact = body.facts[0];
    else if (apiname === 'useless') fact = body.data;
    const embed = this.client.embeds.create('general')
      .setAuthor(`${apilabel} for ${msg.member.displayName}`, msg.author.displayAvatarURL())
      .setDescription(`${fact}`);
    return msg.say(embed).catch(console.error);
  }
};
