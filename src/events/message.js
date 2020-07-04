module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(msg) {
    try {
      if (msg.author.bot) {
        if (msg.author.id === '723153103473344512' && process.env.IN_PRODUCTION === 'dev') {
          msg.author.bot = false;
          this.client.emit('message', msg);
        }
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
      memberData.balance += 5;
      memberData.messageCount += 1;
      memberData.xp += Math.round((Math.random() + 1) * 5);
      memberData.cooldowns.message = Date.now() + 60000;
      memberData.markModified('cooldowns.message');
      await memberData.save();
    } catch (err) {
      console.error(err);
    }
  }
};
