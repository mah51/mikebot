const axios = require('axios');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class GithubCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'github',
      aliases: [
        'git',
        'gh',
      ],
      group: 'lookups',
      memberName: 'github',
      fullName: 'GitHub User Search',
      description: 'Search a user on github',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'user',
          label: 'user',
          prompt: 'Provide a github username',
          type: 'string',
          error: '',
        },
      ],
      guildOnly: false,
    });
  }

  async run(msg, { user }, fromPattern, result) {
    try {
      const url = `https://api.github.com/users/${user}`;

      let res;

      try {
        res = await axios.get(url).then((resolved) => resolved.data);
      } catch (e) {
        return msg.reply('I couldn\'t find that account!');
      }

      const embed = this.client.embeds.create('general')
        .setAuthor('Github', 'https://i.imgur.com/e4HunUm.png')
        .setTitle(res.login)
        .setDescription(`
        **❯ Name:** ${res.name}
        **❯ Bio:** ${res.bio}
        **❯ Location:** ${res.location}
        **❯ ID:** ${res.id}
        **❯ Followers:** ${res.followers}
        **❯ Following:** ${res.following}
        **❯ Repositories:** ${res.public_repos}
        **❯ Created:** ${moment.utc(res.created_at).format('dddd, MMMM Do, YYYY')}
        `)
        .setURL(res.html_url)
        .setThumbnail(res.avatar_url)
        .setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL())
        .setTimestamp();

      await msg.channel.send(embed);
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
