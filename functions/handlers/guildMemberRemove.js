const { MessageEmbed } = require('discord.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    const memberData = await this.client.findMember({ id: member.id, guildID: member.guild.id });
    member.guild.fetch().then(async (guild) => {
      const guildData = await this.client.findGuild({ id: guild.id }, true);
      const goodbyeData = guildData.plugins.goodbye;
      if (goodbyeData && goodbyeData.enabled) {
        const goodbyeEmbed = new MessageEmbed()
          .setFooter(this.client.setting.footer)
          .setColor(this.client.setting.colour)
          .setTimestamp()
          .setThumbnail(member.guild.iconURL({ size: 128 }))
          .setTitle(`${member.displayName}, welcome to ${member.guild.name}`)
          .setDescription(goodbyeData.message);
        let channel = member.client.channels.cache.get(goodbyeData.channel);
        if (!channel) {
          channel = member.client.channels.fetch(channel);
        }
        if (!channel) { return; }
        channel.send(goodbyeEmbed).catch(console.error);
      }
      if (guildData.logs) {
        const channel = member.guild.channels.cache.get(guildData.logs);
        const embed = new MessageEmbed()
          .setColor(this.client.setting.errorcolour)
          .setTimestamp()
          .setAuthor('Member action 🕵️ - 🚶‍♂ Leave 🚶‍♂')
          .setFooter(member.displayName, member.user.displayAvatarURL())
          .setDescription('All member data was removed from the bot\'s database as a storage saving procedure.');
        channel.send(embed).catch(console.error);
      }
      memberData.remove();
    });
  }
};
