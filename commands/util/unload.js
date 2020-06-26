const { oneLine } = require('common-tags');
const Command = require('../../structures/commands');

module.exports = class UnloadCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unload',
      aliases: ['unload-command'],
      group: 'owner-only',
      memberName: 'unload',
      description: 'Unloads a command.',
      details: oneLine`
The argument must be the name/ID (partial or whole) of a command.
Only the bot owner(s) may use this command.
`,
      examples: ['unload some-command'],
      ownerOnly: true,
      guarded: true,
      hidden: true,
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to unload?',
          type: 'command',
        },
      ],
    });
  }

  async run(msg, args, fromPattern, something) {
    args.command.unload();
    await msg.reply(`Unloaded \`${args.command.name}\` command${this.client.shard ? ' on all shards' : ''}.`);
    return null;
  }
};
