const Command = require('../../structures/commands');

module.exports = class MusicPauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pause',
      aliases: [],
      group: 'music',
      memberName: 'pause',
      description: 'Pause the song.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['dj'],
    });
  }

  run(msg) {
    this.client.music.pauseFunction(msg);
  }
};
