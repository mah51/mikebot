const Command = require('../../structures/commands');

module.exports = class ClearMemberInfo extends Command {
  constructor(client) {
    super(client, {
      name: 'reset-balance',
      aliases: [
        'r-b',
      ],
      userRoles: ['admin'],
      userPermissions: ['ADMINISTRATOR'],
      group: 'currency',
      memberName: 'reset-balance',
      description: 'Clear a user\'s balance.',
      details: 'Sets the user\'s balance to 0.',
      examples: [
        'reset-balance @Mikerophone',
      ],
      args: [
        {
          key: 'member',
          label: 'member',
          prompt: 'What member would you like to remove from the database?',
          type: 'member',
        },
      ],
      guildOnly: true,
    });
  }

  async run(msg, args, fromPattern, something) {
    const { member } = args;
    const memberInfo = await this.client.findMember({ id: msg.author.id, guildID: msg.guild.id });
    if (!memberInfo || memberInfo.balance === 0) { return msg.reply('That user does not have any balance info.').catch(console.error); }
    msg.reply(`Balance was reset for ${member.displayName}, they had $${memberInfo.balance}`).catch(console.error);
    memberInfo.balance = 0;
    await memberInfo.save();
  }
};
