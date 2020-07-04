const Command = require('../../structures/commands');

module.exports = class configDelete extends Command {
  constructor(client) {
    super(client, {
      name: 'delete-config',
      aliases: [
        'config-delete',
      ],
      group: 'util',
      memberName: 'delete-config',
      description: 'Enabling this will delete messages used to initiate commands.',
      details: '',
      examples: [

      ],
      args: [

      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const deleteStatus = this.client.provider.get(msg.guild.id, 'deleteSettings');
    if (deleteStatus) {
      this.client.provider.remove(msg.guild.id, 'deleteSettings').catch(console.error);
      return msg.say('The bot will no longer delete messages setting up commands in this server.').catch(console.error);
    }
    this.client.provider.set(msg.guild.id, 'deleteSettings', true).catch(console.error);
    return msg.say('The bot will delete messages that set up commands for this server.').catch(console.error);
  }
};
