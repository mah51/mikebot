const axios = require('axios');
const Command = require('../../structures/commands');
const { shorten } = require('../../util/util');

module.exports = class TrumpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trump-quote',
      aliases: [
        'trump',
      ],
      group: 'fun',
      memberName: 'trump-command',
      fullName: 'Random Trump Quote',
      description: 'Get a good ol\' trump quote (use with caution).',
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
      const res = await axios.get('https://api.tronalddump.io/random/quote');
      if (res.status !== 200) {
        return this.makeError(msg, 'There was a problem fetching a quote from the website 😭');
      }
      const { data } = res;
      const embed = this.client.embeds.create('general')
        // eslint-disable-next-line no-underscore-dangle
        .setAuthor(`${data._embedded.author[0].name} ${data.tags && data.tags[0] ? `on the topic of ${data.tags[0]}` : ''}`, 'https://www.tronalddump.io/img/tronalddump_850x850.png')
        .setDescription(`${shorten(data.value)}`)
        .setTimestamp(data.appeared_at)
        .setFooter(`Requested by ${msg.member.displayName}, quoted on: `, msg.author.displayAvatarURL());
      if (data._embedded.source && data._embedded.source[0] && data._embedded.source[0].url) {
        embed
          .addField('`💣`', `[Source of the quote](${data._embedded.source[0].url})`);
      }
      return msg.say(embed);
    } catch (err) {
      console.error(err);
      await this.onError(msg, args);
    }
  }
};
