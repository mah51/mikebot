const { MessageEmbed } = require('discord.js');
const OWStats = require('overwatch-js');
const axios = require('axios');
const Command = require('../../structures/commands');

module.exports = class OverwatchStatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'overwatch-stats',
      aliases: [
        'ow-stats',
        'owstats',
      ],
      group: 'stats',
      memberName: 'overwatch-stats',
      fullName: 'Overwatch Stats',
      description: 'Get stats for a user in Overwatch',
      details: '',
      examples: [
        'ow-stats profile Mikerophone',
      ],
      args: [
        {
          key: 'platform',
          label: 'platform',
          prompt: 'What platform is the user on? `pc`, `xbox`, or `ps4`',
          type: 'string',
          validate: (query) => ['pc', 'xbox', 'ps4'].includes(query.toLowerCase()),
          error: 'The platform was not valid pick from one of these options: `pc`, `xbox`, or `ps4`',
        },
        {
          key: 'region',
          label: 'region',
          prompt: 'Which region would you like data for? `eu`, `us`, or `asia`',
          validate: (query) => ['eu', 'us', 'asia'].includes(query.toLowerCase()),
          type: 'string',
          error: 'That region was not recognised, pick from one of these: `eu`, `us`, `asia`',
        },
        {
          key: 'tag',
          label: 'tag',
          prompt: 'What is the user\'s battle tag?',
          validate: (query) => query.includes('#'),
          type: 'string',
          error: 'Your battle pass must have the discriminator attached: `Mikerophone#25232`',
        },

      ],
      guildOnly: true,
    });
  }

  async run(msg, { platform, region, tag }, fromPattern, something) {
    const battleTag = tag.replace('#', '-');
    try {
      const data = await OWStats.getOverall(platform.toLowerCase(), region.toLocaleString(), battleTag);
      if (data.achievements && data.competitive.global.all_damage_done) {
        msg.say({
          embed: {
            color: this.client.setting.colour,
            footer: this.client.setting.footer,
            author: {
              name: `${tag} - Lvl: ${Number(data.profile.tier + data.profile.level)}`,
              icon_url: data.profile.rankPicture ? data.profile.rankPicture : data.profile.avatar,
            },
            thumbnail: {
              url: data.profile.avatar,
            },
            title: 'Overwatch Profile',
            url: data.profile.url,
            description: `**W**: ${data.competitive.global.games_won} **T**: ${data.competitive.global.games_tied} **L**: ${data.competitive.global.games_lost}`,
            fields: [{
              name: 'Win rate',
              value: `${((data.competitive.global.games_won / data.competitive.global.games_played) * 100).toFixed(1)}%`,
            },
            {
              name: 'Skill Rating',
              value: data.profile.rank ? data.profile.rank : 'Unranked',
            },
            {
              name: 'Medals',
              value: `🥇: ${data.competitive.global.medals_gold} 🥈: ${data.competitive.global.medals_silver} 🥉: ${data.competitive.global.medals_bronze}`,
            },
            ],
            timestamp: new Date(),
          },
        });
      } else {
        const embed = new MessageEmbed()
          .setFooter(this.client.setting.footer)
          .setColor(this.client.setting.colour)
          .setTimestamp()
          .setAuthor(tag, data.profile.avatar)
          .setImage(data.profile.avatar)
          .setTitle('Overwatch profile')
          .setURL(data.profile.url)
          .setDescription('`❌` That user has a private profile.');
        msg.say(embed);
      }
    } catch (err) {
      if (err.message === 'PROFILE_NOT_FOUND') return this.makeError(msg, `${tag}'s profile was not found in ${region.toUpperCase()} on ${platform.toUpperCase()}`);
      await msg.reply(`There was an error with the request: ${err}`);
      console.error(err);
    }
  }
};
