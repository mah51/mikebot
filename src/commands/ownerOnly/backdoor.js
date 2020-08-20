const Command = require('../../structures/commands');

module.exports = class BackdoorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'bd',
      aliases: [

      ],
      group: 'owner-only',
      memberName: 'bd',
      fullName: 'Backdoor Command',
      description: 'Get\'s an invite to any server.',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'guildId',
          label: 'guildId',
          prompt: 'Provide guild id for the guild you want',
          type: 'string',
        },
      ],
      ownerOnly: true,
      guildOnly: false,
    });
  }

  async run(msg, { guildId }, fromPattern, result) {
    if (!guildId || isNaN(guildId) || guildId.length > 18) return msg.reply('Please provide a guild ID!');
    const guild = this.client.guilds.cache.get(guildId);
    if (!guild) return msg.channel.send(this.client.embeds.create('error').setDescription('The bot isn\'t in that guild.'));
    const invitePossiblites = guild.channels.cache.filter((cha) => cha.permissionsFor(guild.me).has('CREATE_INSTANT_INVITE'));
    if (!invitePossiblites) return msg.channel.send(this.client.embeds.create('error').setDescription('I Couldn\'t fetch a channel that allows me to make an invite.'));

    try {
      invitePossiblites.random().createInvite({ maxUses: 1, maxAge: 300 })
        .then((invite) => {
          msg.channel.send(this.client.embeds.create('general').setDescription(`Success! Found an invite! 
            **[Invite](${`https://discordapp.com/invite/${invite.code})** || **Code:** ${invite.code}`}`));
        });
    } catch (err) {
      console.error(err);
      await this.onError(err, msg);
    }
  }
};
