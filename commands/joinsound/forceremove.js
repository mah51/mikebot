const Command = require('../../structures/commands');

module.exports = class SaveLink extends Command {
  constructor(client) {
    super(client, {
      name: 'fremove-link',
      aliases: ['frmlink', 'frlink'],
      group: 'join-sound',
      memberName: 'forceremovelink',
      description: 'For admins to remove other user\'s join sounds link, and prevents the bot from joining and playing sound effect on user join.',
      guildOnly: true,
      examples: [
        'fremove-link @Mikerophone',
      ],
      userPermissions: ['ADMINISTRATOR'],
      userRoles: ['admin'],
      args: [{
        key: 'member',
        prompt: 'What user\'s link would you like to remove?',
        type: 'member',
      }],
    });
  }

  async run(msg, { member }, fromPattern, something) {
    const memberData = await this.client.findMember({ id: member.id, guildID: msg.guild.id });
    if (!memberData || !memberData.joinSound.url) { return this.makeError(msg, 'Member doesn\'t have a link set up!').catch(console.error); }
    memberData.joinSound.url = null;
    memberData.markModified('joinSound.url');
    await memberData.save();
    return msg;
  }
};
