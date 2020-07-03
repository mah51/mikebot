const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const ForntniteAPI = require('fortnite-api-io');
const Command = require('../../structures/commands');

const API = new ForntniteAPI('a87f3fb5-e6140d17-c43e0dc7-f82c93dd');

module.exports = class FortniteSearch extends Command {
  constructor(client) {
    super(client, {
      name: 'fortnite-stats',
      aliases: [
        'fortnite',
        'fn',
      ],
      fullName: 'Fortnite Stats',
      group: 'stats',
      memberName: 'fortnite-stats',
      description: 'Gets fortnite stats for a specific user',
      details: '',
      examples: [
        'fortnite Mikerophone',
      ],
      args: [
        {
          key: 'username',
          label: 'username',
          prompt: 'What is the user\'s username',
          type: 'string',
        },
      ],
      guildOnly: false,

    });
  }

  async run(msg, { username }, fromPattern, something) {
    msg.channel.startTyping().catch(console.error);
    const userID = await API.getAccountIdByUsername(username);
    if (!userID.result) {
      msg.channel.stopTyping();
      return msg.reply(userID.error).catch(console.error);
    }
    const globalData = await API.getGlobalPlayerStats(userID.account_id);
    if (!globalData.result) {
      msg.channel.stopTyping();
      return msg.reply(globalData.error).catch(console.error);
    }
    const fortniteReply = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`General stats for ${globalData.name}`);
    const arr = Object.keys(globalData.global_stats);
    arr.forEach((mode) => {
      const skrrt = globalData.global_stats[mode];
      fortniteReply
        .addField(mode.split('')[0].toUpperCase() + mode.split('').splice(1).join(''), `**Matches:** ${skrrt.matchesplayed}\n**Playtime:** ${Math.round(moment.duration(skrrt.minutesplayed, 'm').asHours() * 10) / 10} hours\n**Kills: **${skrrt.kills}`, true)
        .addField('\u200b', '\u200b', true)
        .addField('\u200b', `**Win Rate:** ${Math.round(skrrt.winrate * 1000) / 10}\n**Players outlived: ** ${skrrt.playersoutlived}\n**K/D: **${skrrt.kd}`, true);
    });
    msg.channel.stopTyping();
    return msg.reply(fortniteReply).catch(console.error);
  }
};
