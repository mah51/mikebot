const Command = require('../../structures/commands');

module.exports = class MusicRepeatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'repeat',
      aliases: [],
      group: 'music',
      memberName: 'repeat',
      description: 'Repeat a song, queue or disable.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['dj'],
      args: [
        {
          key: 'mode',
          prompt: 'one: Current song, all:Loop entire queue, off: Stop looping',
          type: 'string',
          default: 'one',
        },
      ],
    });
  }

  run(msg, { mode }) {
    this.client.music.repeatFunction(msg, mode);
  }
};
