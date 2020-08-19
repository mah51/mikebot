const Command = require('../../structures/commands');

module.exports = class ITWSSCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'itwss',
      aliases: [
        'twss',
      ],
      group: 'fun',
      memberName: 'itwss',
      fullName: 'Is That What She Said Command',
      description: 'The bot judges every message for an alternative meaning and will tell you if that is what she said.',
      details: '',
      examples: [
        'itwss that was hard',
      ],
      args: [

      ],
      guildOnly: false,
    });
  }

  async run(msg, args, fromPattern, result) {
    try {
      const active = this.client.provider.get(msg.guild.id, 'twss-enabled');
      const embed = this.client.embeds.create(active ? 'error' : 'general')
        .setDescription(active ? 'TWSS has been deactivated' : 'TWSS has been activated')
        .setAuthor(msg.author.username, msg.author.displayAvatarURL());

      await this.client.provider.set(msg.guild.id, 'twss-enabled', !active);
      await msg.reply(embed);
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
