const Command = require('../../structures/commands');

module.exports = class MusicVolumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'volume',
      aliases: [],
      group: 'music',
      memberName: 'volume',
      description: 'Changes the volume of future music sessions.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['DJ'],
      examples: [
        'volume 100',
      ],
      args: [
        {
          key: 'volume',
          prompt: 'Volume 0-200?',
          type: 'integer',
          validate: (volume) => {
            if (volume <= 200 && volume >= 0) return true;
            return false;
          },
        },
      ],
    });
  }

  run(msg, { volume }, fromPattern, result) {
    this.client.music.volumeFunction(msg, volume);
  }
};
