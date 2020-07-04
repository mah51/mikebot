const fs = require('fs');
const { oneLine } = require('common-tags');
const Command = require('../../structures/commands');

module.exports = class LoadCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'load',
      aliases: ['load-command'],
      group: 'owner-only',
      memberName: 'load',
      description: 'Loads a new command.',
      details: oneLine`
The argument must be full name of the command in the format of \`group:memberName\`.
Only the bot owner(s) may use this command.
`,
      examples: ['load some-command'],
      ownerOnly: true,
      guarded: true,
      hidden: true,
      args: [
        {
          key: 'command',
          prompt: 'Which command would you like to load?',
          validate: (val) => new Promise((resolve) => {
            if (!val) return resolve(false);
            const split = val.split(':');
            if (split.length !== 2) return resolve(false);
            if (this.client.registry.findCommands(val).length > 0) {
              return resolve('That command is already registered.');
            }
            const cmdPath = this.client.registry.resolveCommandPath(split[0], split[1]);
            fs.access(cmdPath, fs.constants.R_OK, (err) => (err ? resolve(false) : resolve(true)));
            return null;
          }),
          parse: (val) => {
            const split = val.split(':');
            const cmdPath = this.client.registry.resolveCommandPath(split[0], split[1]);
            delete require.cache[cmdPath];
            // eslint-disable-next-line global-require,import/no-dynamic-require
            return require(cmdPath);
          },
        },
      ],
    });
  }

  async run(msg, args, fromPattern, result) {
    this.client.registry.registerCommand(args.command);
    const command = this.client.registry.commands.last();
    await msg.reply(`Loaded \`${command.name}\` command${this.client.shard ? ' on all shards' : ''}.`);
    return null;
  }
};
