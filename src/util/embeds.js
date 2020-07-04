const { MessageEmbed } = require('discord.js');

class Embeds {
  constructor(client) {
    this.client = client;
    this.colours = {
      general: '#59FF92',
      error: '#FF5251',
      warn: '#FFE423',
      success: '#4BF08C',
      flex: '#ed1c24',
    };
  }

  create(colortype) {
    let colour = '';
    const embed = new MessageEmbed()
      .setFooter('Powered by MikeBot', this.client.user.displayAvatarURL({ size: 256 }))
      .setTimestamp();
    if (colortype) {
      if (this.colours[colortype]) colour = this.colours[colortype];
      else throw Error('Invalid color - check utils/embeds');
    } else {
      colour = this.colours.general;
    }
    embed.setColor(colour);
    return embed;
  }

  colour(colortype) {
    return this.colours[colortype];
  }
}

module.exports = Embeds;
