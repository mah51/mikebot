const Command = require('../../structures/commands');

module.exports = class MusicPauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resume',
      aliases: [],
      group: 'music',
      memberName: 'resume',
      description: 'Resume the playback.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['DJ'],
    });
  }

  run(msg) {
    this.client.music.resumeFunction(msg);
  }
};
