const Command = require('../../structures/commands');

module.exports = class MusicStopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: [],
      group: 'music',
      memberName: 'skip',
      description: 'Skips current song.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['DJ'],
    });
  }

  run(msg) {
    this.client.music.skipFunction(msg);
  }
};
