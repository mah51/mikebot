const Command = require('../../structures/commands');

module.exports = class MusicRemoveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'remove',
      aliases: [],
      group: 'music',
      memberName: 'remove',
      description: 'Remove a song from the queue.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['dj'],
      args: [
        {
          key: 'index',
          prompt: 'Index of the song?',
          type: 'string',
        },
      ],
    });
  }

  run(msg, { index }) {
    this.client.music.removeFunction(msg, index);
  }
};
