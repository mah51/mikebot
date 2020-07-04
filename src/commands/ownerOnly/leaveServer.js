const Command = require('../../structures/commands');

module.exports = class leaveServer extends Command {
  constructor(client) {
    super(client, {
      name: 'leave-server',
      aliases: [

      ],
      group: 'owner-only',
      memberName: 'leave-sever',
      description: 'Leaves a guild',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'guildID',
          label: 'guildID',
          prompt: 'What guild would you like to leave?',
          type: 'string',
        },
      ],
      guildOnly: false,
      ownerOnly: true,
      hidden: true,
    });
  }

  async run(msg, { guildID }, fromPattern, something) {
    const guild = this.client.guilds.cache.get(guildID);
    if (guild.size === 0) { return msg.reply('No guild found').catch(console.error); }
    guild.leave().then((g) => {
      console.log(`LEFT GUILD ${g.name}`);
      return msg.reply(`Left the guild: ${g.name}`);
    }).catch(console.error);
    return null;
  }
};
