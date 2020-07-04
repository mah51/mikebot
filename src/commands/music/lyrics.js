const { MessageEmbed } = require('discord.js');
const genius = require('genius-lyrics');
const Command = require('../../structures/commands');

const Genius = new genius.Client(process.env.GENIUS_KEY);

module.exports = class lyrics extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      aliases: [

      ],
      group: 'music',
      memberName: 'lyrics',
      description: 'Search up lyrics for a song.',
      details: '',
      examples: [
        'lyrics that one night',
      ],
      args: [
        {
          key: 'query',
          prompt: 'What song would you like to search for?',
          type: 'string',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { query }, fromPattern, result) {
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp();

    function addEmbedxd(info) {
      embed.addField('\u200b', `\`\`\`${info}\`\`\``);
    }
    Genius.tracks.search(query, { limit: 1 })
      .then((res) => {
        const song = res[0];
        embed
          .setTitle(`Lyrics for ${song.title}`)
          .setDescription(`Provided by genius: ${song.url}`);
        song.lyrics()
          .then((data) => {
            data.split('\n\n').forEach((text) => {
              while (text.length > 2000) {
                addEmbedxd(text);
                // eslint-disable-next-line no-param-reassign
                text = text.slice(2000);
              }
              addEmbedxd(text);
            });
            return msg.say({ embed }).catch(console.error);
          }).catch(console.error);
      }).catch(console.error);
  }
};
