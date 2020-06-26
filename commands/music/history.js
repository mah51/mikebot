const Command = require('../../structures/commands');

module.exports = class MusicHistoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'history',
      aliases: [],
      group: 'music',
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['dj'],
      memberName: 'history',
      description: 'Shows playback history.',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async run(msg) {
    this.client.music.showHistoryFunction(msg);
  }
};
