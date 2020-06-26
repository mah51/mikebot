const Command = require('../../structures/commands');

module.exports = class ClearBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clear-bot',
      group: 'server-tools',
      memberName: 'clear-bot',
      description: 'Clears messages sent by the bot.',
      details: 'Searches <1-100> number of messages and deletes those sent by the bot, or if inversed clear all messages apart from the bots!',
      examples: ['clear-bot 5'],
      userPermissions: ['MANAGE_MESSAGES'],
      clientPermissions: ['MANAGE_MESSAGES'],
      args: [{
        key: 'num',
        label: 'num',
        prompt: 'How many bot message would you like me to search?',
        err: 'That was not a valid input! make sure you input a whole number eg. 5.',
        type: 'integer',
        infinite: false,
      },
      {
        key: 'inversed',
        label: 'inversed',
        prompt: 'Reply true if you want to delete all messages apart from those by the bot.',
        type: 'boolean',
        default: false,
      }],
      guildOnly: true,
    });
  }

  async run(msg, { num, inversed }, fromPattern, something) {
    if (num > 100) {
      num = 100;
    }
    const unfilteredMessages = await msg.channel.messages.fetch({ limit: num });
    const messages = unfilteredMessages.filter((message) => {
      if (inversed) {
        return message.author.id !== msg.client.user.id;
      }
      return message.author.id === msg.client.user.id;
    });
    return msg.channel.bulkDelete(messages, false).then((messages) => {
      msg.reply(`I searched the last 100 messages. I found and deleted ${messages.size} messages${inversed ? ' not' : ''} sent by me!`).then((magga) => {
        magga.delete({ timeout: 4000 });
      }).catch(console.error);
    }).catch(console.error);
  }
};
