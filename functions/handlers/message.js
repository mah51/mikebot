module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(msg) {
    if (msg.author.bot) {
      return;
    }
    if (!msg.guild) {
      return;
    }
    if (msg.client.provider.get(msg.guild.id, 'grp-currency') === false) {
      return;
    }
    const memberData = await msg.client.findMember({ id: msg.author.id, guildID: msg.guild.id }, false);
    if (memberData.cooldowns.message > Date.now()) { return; }
    memberData.balance += 10;
    memberData.messageCount += 1;
    memberData.xp += Math.round((Math.random() + 1) * 5);
    memberData.cooldowns.message = Date.now() + 60000;
    memberData.markModified('cooldowns.message');
    await memberData.save();
  }
};
