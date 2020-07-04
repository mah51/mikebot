const Command = require('../../structures/commands');

module.exports = class MusicRepeatCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'repeat',
      aliases: [],
      group: 'music',
      memberName: 'repeat',
      description: 'Repeat a song once, all or disable.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['DJ'],
      examples: [
        'repeat one',
        'repeat all',
        'repeat off',
      ],
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
