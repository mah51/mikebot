const Command = require('../../structures/commands');

module.exports = class MusicShuffleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shuffle',
      aliases: [],
      group: 'music',
      memberName: 'shuffle',
      description: 'Shuffles current queue.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['dj'],
    });
  }

  run(msg) {
    this.client.music.shuffleFunction(msg);
  }
};
