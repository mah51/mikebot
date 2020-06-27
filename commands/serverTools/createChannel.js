const Command = require('../../structures/commands');

module.exports = class createChannel extends Command {
  constructor(client) {
    super(client, {
      name: 'vc-tool',
      aliases: [
        'voice-channel',
      ],
      group: 'server-tools',
      memberName: 'vc-tool',
      description: 'Command to manipulate voice channels. Can be used to create / delete voice channels.',
      examples: [
        '.vc-tool create Voice1 ',
        '.vc-tool create "Voice Channel"',
      ],
      userPermissions: ['MANAGE_CHANNELS'],
      clientPermissions: ['MANAGE_CHANNELS'],
      args: [
        {
          key: 'action',
          label: 'action',
          prompt: 'What would you like to do this channel?',
          type: 'string',
        },
        {
          key: 'name',
          label: 'name',
          prompt: 'What is the name or id of the target channel?',
          type: 'string',
        },

      ],
      guildOnly: true,
    });
  }

  async run(msg, { action, name }, fromPattern, something) {
    if (action === 'create') {
      msg.guild.channels.create(name, {
        type: 'voice',
      }).catch(console.error);
    } else if (action === 'delete') {
      const targetChannel = msg.guild.channels.cache.find((channel) => channel.name === name || channel.id === name);
      targetChannel.delete(`MikeBot vc-info command called by ${msg.author.id}`).catch(console.error);
      msg.reply('Target channel deleted!').catch(console.error);
    } else {
      return msg.reply('Action was not recognised.');
    }
  }
};
