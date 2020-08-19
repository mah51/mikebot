const twss = require('twss');
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
      const string = args.phrase;
      const bool = twss.is(string);
      const prob = twss.probability(string);
      const embed = this.client.embeds.create(bool ? 'general' : 'error')
        .setAuthor(msg.member ? msg.member.displayName : msg.author.username, msg.author.displayAvatarURL({ size: 256 }))
        .setTitle(`That's ${bool ? '**IS**' : '**IS NOT**'} what she said.`)
        .setDescription(`I have calculated that is ${bool ? '' : '**NOT**'} what she said.`)
        .addField('Certainty', `${Math.round(prob * 100) / 100}%`, true);
      return msg.say(embed);
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
