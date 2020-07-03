const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const Command = require('../../structures/commands');
const getMode = require('../../functions/other/rlRanks');

module.exports = class rlLookupCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rl-stats',
      aliases: [
        'rl-search',
        'rl',
      ],
      fullName: 'Rocket League Stats',
      group: 'stats',
      memberName: 'rl',
      description: 'Search for a player on the rlTracker db.',
      details: '',
      examples: [
        'rl michael_1 pc',
        'rl michael_1 pc 2v2',
        'rl michael_1 pc solo 3v3',
      ],
      args: [
        {
          key: 'player',
          label: 'player',
          prompt: 'Which player would you like to look up?',
          type: 'string',
        },
        {
          key: 'platform',
          label: 'platform',
          prompt: 'What platform is the player on?',
          type: 'string',
          oneOf: ['pc', 'xbox', 'ps'],
          error: 'That is not a valid platform type, please reply with pc, xbox, or ps.',
        },

        {
          key: 'mode',
          label: 'mode',
          prompt: 'Enter the game mode you would like to get more info on, if you leave this blank only general info will be provided.',
          type: 'string',
          default: '',
        }],
      guildOnly: false,
    });
  }

  async run(msg, { platform, player, mode }, fromPattern, something) {
    switch (platform.toLowerCase()) {
      case 'pc':
        platform = 3;
        break;
      case 'ps':
        platform = 2;
        break;
      case 'xbox':
        platform = 1;
        break;
      default:
        platform = false;
        break;
    }
    if (!platform) { return msg.reply('That is not a known platform.'); }
    const req = await axios.get(`https://rocketleague.tracker.network/api/v1/standard/profile/${platform}/${player}`);
    if (req.errors) { return msg.reply(`There was an error: ${req.errors[0].message}`).catch(console.error); }
    if (mode) {
      mode = await getMode(mode);
      if (mode === null) {
        const errEmbed = new MessageEmbed()
          .setFooter(this.client.setting.footer)
          .setColor(this.client.setting.colour)
          .setTimestamp()
          .setTitle('Rocket League game mode titles:')
          .setDescription('Un-ranked\nRanked duel 1v1(1v1)\nRanked doubles 2v2(2v2)\nRanked solo standard 3v3(solo 3v3)\nRanked standard 3v3(3v3)\nHoops\nRumble\nDropshot\nSnowday\n🏎');

        return msg.reply('That game mode was not recognised... here is a list of game mode names:', errEmbed).catch(console.error);
      }

      const metadata = req.data.stats.filter((modes) => modes.metadata.key === `rating_${mode}`)[0];
      const data = req.data.children.filter((datac) => datac.id === mode.toString())[0];
      if (!metadata || !data) {
        return msg.reply(`Data could not be found for that playlist for that user. Data exists for the following playlists: \`${req.data.metadata.segmentControls[0].options.map((option) => option.label).join('`, `')}\``).catch(console.error);
      }
      msg.channel.startTyping().catch(console.error);
      const gameMode = metadata.metadata.name;
      const platformHandle = req.data.metadata.platformUserHandle;
      const currentRank = metadata.metadata.description;
      const { iconUrl } = metadata.metadata;
      const currentMMR = metadata.displayValue;
      const { percentile } = metadata;
      const matches = data.stats[1].displayValue;
      const streakName = data.stats[2].metadata.name;
      const streakVal = data.stats[2].displayValue;

      const embed = new MessageEmbed()
        .setFooter(this.client.setting.footer)
        .setColor(this.client.setting.colour)
        .setTimestamp()
        .setTitle(`${gameMode} data for ${platformHandle}`)
        .setDescription(`Their current rank is ${currentRank}`)
        .setThumbnail(iconUrl)
        .addField('MMR', currentMMR, true)
        .addField('\u200b', '\u200b', true)
        .addField('Percentile', percentile, true)
        .addField('Number of matches this season', matches, true)
        .addField('\u200b', '\u200b', true)
        .addField(streakName, streakVal, true);
      return msg.reply(embed).then(() => msg.channel.stopTyping()).catch(console.error);
    }
    const { metadata } = req.data;
    if (!metadata) { return msg.reply('Data could not be found for that playlist for that user.').catch(console.error); }
    msg.channel.startTyping().catch(console.error);
    const goalShot = req.data.stats.filter((thing) => thing.metadata.key === 'root_GoalShotRatio')[0].displayValue;
    const wins = req.data.stats.filter((thing) => thing.metadata.key === 'root_Wins')[0].displayValue;
    const goals = req.data.stats.filter((thing) => thing.metadata.key === 'root_Goals')[0].displayValue;
    const saves = req.data.stats.filter((thing) => thing.metadata.key === 'root_Saves')[0].displayValue;
    const shots = req.data.stats.filter((thing) => thing.metadata.key === 'root_Shots')[0].displayValue;
    const mvps = req.data.stats.filter((thing) => thing.metadata.key === 'root_MVPs')[0].displayValue;
    const assists = req.data.stats.filter((thing) => thing.metadata.key === 'root_Assists')[0].displayValue;
    const mvpWin = req.data.stats.filter((thing) => thing.metadata.key === 'root_')[0].displayValue;
    const reward = req.data.stats.filter((thing) => thing.metadata.key === 'root_SeasonRewardLevel')[0];
    const rewardImage = reward.iconUrl;

    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setThumbnail(rewardImage)
      .setTitle(`Stats for ${metadata.platformUserHandle}`)
      .addField('Wins / MVPS', `**Total MVPs: **${mvps}\n**Total Wins: **${wins}\n**MVP/Win:** ${mvpWin}`, true)
      .addField('\u200b', '\u200b', true)
      .addField('Goals / Shots', `**Total Shots: **${shots}\n**Total Goals: **${goals}\n**Goals/Shots:** ${goalShot}`, true)
      .addField('Total Saves', saves, true)
      .addField('Total Assists', assists, true);
    return msg.reply(embed).then(() => msg.channel.stopTyping()).catch(console.error);
  }
};
