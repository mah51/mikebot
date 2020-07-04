const axios = require('axios');
const { shorten } = require('../../util/util');
const Command = require('../../structures/commands');

module.exports = class AdviceCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'advice',
      aliases: [

      ],
      group: 'fun',
      memberName: 'advice',
      fullName: 'Advice Slip',
      description: 'Get advice from a bot, because they always know what to do.',
      details: '',
      examples: [

      ],
      args: [

      ],
      guildOnly: false,
    });
  }

  async run(msg, args, fromPattern, something) {
    try {
      const res = await axios.get('https://api.adviceslip.com/advice');
      if (res.status !== 200) {
        return this.makeError(msg, 'There was a problem fetching a quote from the website 😭');
      }
      const { data } = res;
      const embed = this.client.embeds.create('general')
        .setAuthor(`${msg.member.displayName} here's some great advice!`, msg.author.displayAvatarURL({ size: 256 }))
        .setDescription(`\`👴:\` ${shorten(data.slip.advice)}`);
      return msg.say(embed);
    } catch (err) {
      console.error(err);
      await this.onError(msg, args);
    }
  }
};
