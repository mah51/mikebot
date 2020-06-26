const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class whoLegend extends Command {
  constructor(client) {
    super(client, {
      name: 'wholegend',
      aliases: ['wl'],
      group: 'fun',
      memberName: 'wholegend',
      description: 'Tells the user, who the legend is on the server.',

    });
  }

  async run(msg, args, fromPattern, something) {
    const members = await msg.guild.members.fetch();
    const member = members.random();
    const embed = new MessageEmbed()
      .setTitle(member.user.username)
      .setDescription('is the legend of the server! well done sir.')
      .setColor(this.client.setting.color)
      .setThumbnail(member.user.avatarURL({ size: 64 }));
    return msg.channel.send(embed).catch(console.error);
  }
};
