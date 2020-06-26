const Command = require('../../structures/commands');

module.exports = class removeAll extends Command {
  constructor(client) {
    super(client, {
      name: 'remove-all',
      aliases: ['rall', 'ra', 'rmall'],
      group: 'join-sound',
      memberName: 'removeall',
      description: 'Removes all user\'s links! Administrators only, use carefully as deletion is irreversible.',
      guildOnly: true,
      userPermissions: ['ADMINISTRATOR'],
      userRoles: ['admin'],
    });
  }

  async run(msg, args, fromPattern, something) {
    const members = await msg.guild.members.fetch();
    for (const member of members) {
      const memberData = await this.client.findMember({ id: member.id, guildID: msg.guild.id });
      if (!memberData || memberData.joinSound.url === null) { return; }
      memberData.joinSound.url = null;
      await memberData.save();
    }
    return msg.say('Deleted all join sound info.').catch(console.error);
  }
};
