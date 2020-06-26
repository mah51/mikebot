const Command = require('../../structures/commands');

module.exports = class ClearChat extends Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      aliases: ['cc', 'clear-chat', 'clear-msg'],
      group: 'server-tools',
      memberName: 'clear',
      description: 'Clears x number of messages.',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_MESSAGES'],
      examples: [
        'clear 100',
      ],
      args: [{
        key: 'num',
        prompt: 'Number of messages to clear!',
        type: 'integer',
      }],
    });
  }

  async run(msg, { num }, fromPattern, something) {
    if (num > 100) {
      num = 100;
    }
    msg.channel.bulkDelete(num, false)
      .then((deleted) => msg.reply(`I deleted ${deleted.size} messages.`).catch(console.error)
        .then((message) => {
          message.delete({ timeout: 4000 });
        })).catch((err) => msg.reply(`Something went wrong ${err}`));
  }
};
