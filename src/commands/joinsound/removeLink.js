const Command = require('../../structures/commands');

module.exports = class SaveLink extends Command {
  constructor(client) {
    super(client, {
      name: 'remove-link',
      aliases: ['rlink', 'rmlink'],
      group: 'join-sound',
      memberName: 'removelink',
      guildOnly: true,
      description: 'Removes the join sounds link, so bot will not play a sound when you join.',
    });
  }

  async run(msg, { link }, fromPattern, something) {
    const memberInfo = await this.client.findMember({ id: msg.member.id, guildID: msg.guild.id });
    if (!memberInfo || !memberInfo.joinSound.url) { return this.makeError(msg, 'No link is set up. Use .save-link <link> to add one.').catch(console.error); }
    memberInfo.joinSound.url = null;
    memberInfo.markModified('joinSound.url');
    memberInfo.save();
    msg.reply('Your link has been removed and the bot will no longer play join sounds for you.').catch(console.error);
  }
};
