const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class modLog extends Command {
  constructor(client) {
    super(client, {
      name: 'config-log',
      aliases: [

      ],
      group: 'util',
      memberName: 'config-log',
      description: 'Set up a channel for moderation events.',
      details: '',
      examples: [

      ],
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 'channel',
          label: 'channel',
          prompt: 'What channel would ',
          type: 'channel',
          validate: (query) => query.type === 'text',
        },

      ],
      guildOnly: true,
    });
  }

  async run(msg, { channel }, fromPattern, something) {
    const data = await this.getData(msg);
    data.guild.logs = channel.id;
    data.guild.markModified('logs');
    data.guild.save();
    if (!msg.guild.me.permissionsIn(channel).has('SEND_MESSAGES')) { return this.makeError(msg, 'Bot does not have permissions to send messages in this channel.'); }
    const embed = new MessageEmbed()
      .setFooter(this.client.setting.footer)
      .setColor(this.client.setting.colour)
      .setTimestamp()
      .setTitle('Updated channel!')
      .setDescription(`${channel.name} is now the logging channel!`);
    return msg.reply(embed).catch(console.error);
  }
};
