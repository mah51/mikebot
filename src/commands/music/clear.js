const Command = require('../../structures/commands');

module.exports = class MusicClearCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clear-queue',
      aliases: ['c-q'],
      group: 'music',
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['DJ'],
      memberName: 'clear-queue',
      description: 'Clears current music queue.',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async run(msg) {
    this.client.music.clearFunction(msg);
  }
};
