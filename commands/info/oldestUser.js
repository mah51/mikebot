const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class OldestUser extends Command {
  constructor(client) {
    super(client, {
      name: 'oldest-user',
      aliases: [

      ],
      group: 'info',
      memberName: 'oldest-user',
      description: 'Finds the oldest (or youngest) user in the server.',
      details: '',
      examples: [
        'oldest-user',
        'oldest-user true',
      ],
      args: [
        {
          key: 'inverted',
          label: 'inverted',
          prompt: 'Type true here to find the youngest user',
          type: 'boolean',
          default: '',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { inverted }, fromPattern, something) {
    const users = await msg.guild.members.fetch();
    const members = users.sort((a, b) => a.user.createdAt - b.user.createdAt);
    const member = inverted ? members.last() : members.first();
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle(`${member.user.username}#${member.user.discriminator} has the ${inverted ? 'youngest' : 'oldest'} account on the server!`)
      .setDescription(`It was created on ${moment(member.user.createdAt).format('LLLL')}`);
    return msg.reply(embed).catch(console.error);
  }
};
