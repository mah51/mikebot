const Command = require('../../structures/commands');

module.exports = class MusicClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clear-queue',
      aliases: ['c-q'],
      group: 'music',
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['dj'],
      memberName: 'clear-queue',
      description: 'Clears Queue',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async run(msg) {
    this.client.music.clearFunction(msg);
  }
};
