const { MessageEmbed } = require('discord.js');

class Embeds {
  constructor(client) {
    this.client = client;
    this.colors = {
      general: '#59FF92',
      error: '#FF5251',
      warn: '#FFE423',
      success: '#4BF08C',
    };
  }

  create(colortype) {
    let color = '';
    const embed = new MessageEmbed()
      .setFooter('Powered by MikeBot', this.client.user.displayAvatarURL())
      .setTimestamp();
    if (colortype) {
      if (this.colors[colortype]) color = this.colors[colortype];
      else throw Error('Invalid color - check utils/embeds');
    } else {
      color = this.colors.general;
    }
    embed.setColor(color);
    return embed;
  }

  color(colortype) {
    return this.colors[colortype];
  }
}

module.exports = Embeds;
