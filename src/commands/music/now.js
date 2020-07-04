const Command = require('../../structures/commands');

module.exports = class MusicNowPlayingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'now-playing',
      aliases: ['np'],
      group: 'music',
      memberName: 'np',
      description: 'Shows the song currently playing.',
      clientPermissions: ['EMBED_LINKS'],
    });
  }

  async run(msg) {
    this.client.music.nowPlayingFunction(msg);
  }
};
