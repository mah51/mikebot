const Command = require('../../structures/commands');

module.exports = class ListServersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'list-servers',
      aliases: [

      ],
      group: 'owner-only',
      memberName: 'list-servers',
      fullName: 'List Servers Command',
      description: 'List all servers.',
      details: '',
      examples: [

      ],
      args: [

      ],
      guildOnly: false,
    });
  }

  async run(msg, args, fromPattern, result) {
    try {
      await msg.reply(`\n${this.client.guilds.cache.sort((a, b) => a.memberCount - b.memberCount).array().reverse().map((guild, index) => `**${index + 1}. ${guild.name}** - ${guild.id} (${guild.memberCount} members)`)
        .join('\n')}`);
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
