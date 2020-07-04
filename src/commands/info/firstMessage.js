const { MessageEmbed } = require('discord.js');
const Command = require('../../structures/commands');

module.exports = class firstMessage extends Command {
  constructor(client) {
    super(client, {
      name: 'first-message',
      aliases: [

      ],
      group: 'info',
      memberName: 'first-message',
      description: 'Gets the first message sent in a channel.',
      details: '',
      examples: [
        'first-message #general',
      ],
      args: [
        {
          key: 'channel',
          prompt: 'Which channel would you like to get the first message of?',
          type: 'channel',
          default: (msg) => msg.channel,
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, { channel }) {
    if (!this.checkChannelPerms(msg, channel, msg.guild.me, ['READ_MESSAGE_HISTORY'])) { return; }
    const messages = await channel.messages.fetch({ after: 1, limit: 1 });
    const message = messages.first();
    const embed = new MessageEmbed()
      .setColor(this.client.setting.colour)
      .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setAuthor(`Sent by ${message.author.tag}`)
      .setDescription(message.content)
      .setTimestamp(message.createdAt)
      .setFooter(this.client.setting.footer)
      .addField('Link to message.', message.url);
    return msg.embed(embed);
  }
};
