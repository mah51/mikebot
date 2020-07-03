const Command = require('../../structures/commands');

module.exports = class WelcomeMessage extends Command {
  constructor(client) {
    super(client, {
      name: 'welcome-message',
      aliases: [
        'welcome',
      ],
      group: 'server-tools',
      memberName: 'welcome-message',
      description: 'Set up a welcome message in your server to welcome new members 😋.',
      details: '',
      userPermissions: ['ADMINISTRATOR'],
      userRoles: ['Admin'],
      examples: [
        'welcome-message enable #general {{user}}, welcome to the server!',
      ],
      args: [
        {
          key: 'enable',
          label: 'enable',
          prompt: 'Would you like to enable or disable welcome messages?',
          type: 'string',
          validate: (query) => ['enable', 'disable', 'test'].includes(query.toLowerCase()),
          error: 'Type in `enable` or `disable` (or `test` to show what the embed will look like)',
        },
        {
          key: 'channel',
          label: 'channel',
          prompt: 'What channel would you the enable message to be sent in?',
          type: 'channel',
          default: '',
        },
        {
          key: 'message',
          label: 'message',
          prompt: 'What channel would you like it the message to be sent in?',
          type: 'string',
          default: '{{user}}, Welcome to {{guild}}, enjoy your stay!',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    let { message, channel } = args;
    const enable = args.enable.toLowerCase();
    if (!this.checkPerms(msg, ['ADMINISTRATOR'], ['Admin'])) return;
    const guild = this.client.findGuild({ id: msg.guild.id });

    switch (enable) {
      case 'test':
        this.client.emit('guildMemberAdd', message.member);
        this.makeSuccess(msg, 'Successfully ran test.').catch(console.error);
        break;
      case 'enable':
        if (!channel) { channel = guild.systemChannel; }
        guild.plugins.welcome.channel = channel;
        guild.plugins.welcome.message = message;
        guild.plugins.welcome.enabled = true;
        guild.plugins.welcome.withImage = true;
        guild.markModified('plugins.welcome');
        await guild.save();
        this.client.emit('guildMemberAdd', message.member);
        this.makeSuccess(msg, 'Welcome message updated and active.');
        break;
      case 'disable':
        guild.plugins.welcome.channel = null;
        guild.plugins.welcome.message = null;
        guild.plugins.welcome.enabled = false;
        guild.plugins.welcome.withImage = false;
        guild.markModified('plugins.welcome');
        await guild.save();
        this.makeSuccess(msg, 'Welcome message disabled.');
        break;
      default:
        this.makeError(msg, 'That action was not recognised').catch(console.error);
        break;
    }
  }
};
