const Command = require('../../structures/commands');

module.exports = class MusicStopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      aliases: [],
      group: 'music',
      memberName: 'stop',
      description: 'Stops playback and clears queue.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['DJ'],
    });
  }

  run(msg) {
    this.client.music.stopFunction(msg);
  }
};
