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
      description: 'Returns top ten users with the most xp in a server.',
      details: '',
      args: [

      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const members = await this.client.membersData.find({ guildID: msg.guild.id }).lean();
    const leaderboardData = members.sort((a, b) => b.xp - a.xp);
    const users = leaderboardData.map((member) => member.id);
    const guildMembers = await msg.guild.members.fetch({ user: users, cache: false }).catch((err) => {});
    const description = leaderboardData.map((mem, index) => {
      const member = guildMembers.get(mem.id);
      return `**⇾ ${index + 1}.** ${member.displayName}, ${mem.xp} xp`;
    }).join('\n');
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`Top members for ${msg.guild.name}`)
      .setDescription(description);
    return msg.reply(embed).catch(console.error);
  }
};
