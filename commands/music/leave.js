const Command = require('../../structures/commands');

module.exports = class MusicLeaveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: [],
      group: 'music',
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['dj'],
      memberName: 'leave',
      description: 'Leaves the voice channel.',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async run(msg) {
    this.client.music.leaveFunction(msg);
  }
};
