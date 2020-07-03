const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const Command = require('../../structures/commands');
const { queryFormatter } = require('../../util/util');

module.exports = class MovieLookup extends Command {
  constructor(client) {
    super(client, {
      name: 'movie-search',
      aliases: ['movie-lookup', 'ms', 'moviesearch', 'movies', 'movie'],
      group: 'lookups',
      memberName: 'movie-search',
      description: 'Searches for a movie.',
      nsfw: true,
      examples: ['movie-search Inception'],
      args: [{
        key: 'query',
        prompt: 'What movie would you like to search for?',
        type: 'string',
      }],

    });
  }

  async run(msg, { query }, fromPattern, something) {
    if (msg.channel.type === 'text') {
      if (!msg.channel.nsfw) return msg.reply('The channel you are trying to send this in is SFW, to enable this command toggle NSFW in the channel settings').catch(console.error);
    }
    const queryS = queryFormatter(query);
    const req = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=91caf4b0137befd5efad32446c36cc3c&language=en-US&query=${queryS}&page=1&include_adult=true`);
    const reqs = req.data.results;
    if (reqs.length === 0) {
      await msg.say('Movie not found :/.');
    } else if (req === 'undefined') {
      await msg.say('Movie db api did not respond 😢');
    } else {
      const embed = new MessageEmbed();
      embed
        .setColor(this.client.setting.colour)
        .setFooter(this.client.setting.footer)
        .setTitle(`Title - ${reqs[0].title}`)
        .setAuthor(`${req.data.total_results} results, showing most relevant.`)
        .setDescription(`${reqs[0].overview}`)
        .setImage(`https://image.tmdb.org/t/p/original/${reqs[0].poster_path}`)
        .setTimestamp()
        .addFields([
          { name: 'Rating', value: reqs[0].vote_average, inline: true },
          { name: 'Popularity', value: reqs[0].popularity, inline: true },
          { name: 'Release Date', value: reqs[0].release_date },
        ]);

      return msg.say(embed).catch(console.error);
    }
  }
};
