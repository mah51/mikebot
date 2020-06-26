const { MessageEmbed } = require('discord.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    const guildData = await this.client.findGuild({ id: member.guild.id });

    if (!guildData.plugins.welcome.enabled) { return; }
    const embed = new MessageEmbed()
      .setFooter(member.client.setting.footer)
      .setColor(member.client.setting.colour)
      .setTimestamp()
      .setThumbnail(member.guild.iconURL({ size: 128 }))
      .setTitle(`${member.displayName}, welcome to ${member.guild.name}`)
      .setDescription(guildData.plugins.welcome.message);
    let channel = member.client.channels.cache.get(guildData.plugins.welcome.channel) || member.client.channels.fetch(guildData.plugins.welcome.channel).catch((err) => {
      channel = member.guild.systemChannel;
    });
    if (!channel) { return; }
    channel.send(embed).catch(console.error);
  }
};
