const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class getLeaderboard extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      aliases: [
        'leaderboard',
        'lb',
        'currency-lb',
      ],
      group: 'currency',
      memberName: 'currency-leaderboard',
      description: 'Gets the top ten users of a server.',
      details: '',
      examples: [

      ],
      args: [

      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const leaderboardData = await this.client.membersData.find({ guildID: msg.guild.id }).sort({ xp: -1 });
    const users = leaderboardData.map((member) => member.id);
    const guildMembers = await msg.guild.members.fetch({ user: users, cache: false }).catch((err) => {});
    const description = guildMembers.array().map((member, index) => `**⇾ ${index + 1}.** ${member.displayName}, ${leaderboardData.filter((lbd) => lbd.id === member.id)[0].xp} xp`).join('\n');
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`Top members for ${msg.guild.name}`)
      .setDescription(description);
    return msg.reply(embed).catch(console.error);
  }
};
