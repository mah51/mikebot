const Command = require('../../structures/commands');

module.exports = class MusicLeaveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: [],
      group: 'music',
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['DJ'],
      memberName: 'leave',
      description: 'Forces bot to leave the voice channel it is currently in.',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async run(msg) {
    this.client.music.leaveFunction(msg);
  }
};
