const Command = require('../../structures/commands');

module.exports = class MusicPlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: [],
      group: 'music',
      memberName: 'play',
      description: 'Play a song.',
      clientPermissions: ['EMBED_LINKS'],
      userPermissions: ['MANAGE_CHANNELS'],
      userRoles: ['DJ'],
      examples: [
        'play https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ],
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
    if (!msg.member.voice.channel.permissionsFor(msg.guild.me).has(['CONNECT', 'SPEAK'])) { return this.makeError(msg, 'I don\'t have permission to join that voice channel!'); }
    const { query } = args;
    await this.client.music.playFunction(msg, query);
  }
};
