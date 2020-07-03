const { MessageEmbed } = require('discord.js');

module.exports = async (client) => {
  if (client.membersData === undefined) return;
  const muted = await client.membersData.find({ 'mute.muted': true, 'mute.endDate': { $lte: Date.now() } });
  for (const memberData of muted) {
    const guild = client.guilds.cache.get(memberData.guildID);
    // eslint-disable-next-line no-continue
    if (!guild) continue;
    // eslint-disable-next-line no-await-in-loop
    const member = guild.members.cache.get(memberData.id) || await guild.members.fetch(memberData.id).catch((err) => {
      memberData.mute = {
        muted: false,
        endDate: null,
        case: null,
      };
      memberData.save();
      client.logger.log(`[unmute] ${memberData.id} cannot be found.`);
    });
    // eslint-disable-next-line no-continue
    if (!member) continue;
    // eslint-disable-next-line no-await-in-loop
    const guildData = await client.findGuild({ id: guild.id });
    guild.channels.cache.forEach((channel) => {
      const permOverwrites = channel.permissionOverwrites.get(member.id);
      if (permOverwrites) permOverwrites.delete();
    });

    memberData.mute = {
      muted: false,
      endDate: null,
      case: null,
    };
    // eslint-disable-next-line no-await-in-loop
    const user = await client.users.fetch(memberData.id);
    memberData.save();

    // eslint-disable-next-line no-continue
    if (!user) continue;
    const logEmbed = new MessageEmbed()
      .setFooter(client.setting.footer)
      .setColor(client.setting.colour)
      .setTimestamp()
      .setAuthor('Moderation ⚔️ - 🦶 UNMUTED 🦶')
      .setDescription(`${user.username}#${user.discriminator} was unmuted.`);
    const channel = guild.channels.cache.get(guildData.logs);
    if (channel) {
      channel.send(logEmbed);
    }
  }
};
