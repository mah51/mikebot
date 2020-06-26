const Command = require('../../structures/commands');

module.exports = class MusicPlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: [],
      group: 'music',
      memberName: 'play',
      description: 'Play a song or resume playback.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['dj'],
      args: [
        {
          key: 'query',
          prompt: 'What song would you like to play?',
          type: 'string',
        },
      ],
    });
  }

  async run(msg, args, fromPattern, result) {
    if (!msg.member.voice.channel) { return msg.reply({ embed: { description: 'You need to be in a voice channel to use this command.', color: this.client.setting.colour } }); }
    if (!this.checkChannelPerms(msg, msg.member.voice.channel, msg.member, ['CONNECT', 'SPEAK'])) { return; }
    const { query } = args;
    await this.client.music.playFunction(msg, query);
  }
};
