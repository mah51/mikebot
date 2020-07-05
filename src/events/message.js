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
      const memberData = await msg.client.findMember({ id: msg.author.id, guildID: msg.guild.id });
      if (msg.content.startsWith('.') && this.client.registry.commands.get(msg.content.split(' ')[0].slice(1))) {
        if (!memberData.cooldowns.commands) {
          memberData.cooldowns.commands = 0;
        }
        if (memberData.cooldowns.commands < Date.now()) {
          memberData.balance += Math.ceil(Math.random() * 7);
          memberData.xp += Math.round((Math.random() + 1) * 5);
          memberData.cooldowns.commands = Date.now() + 60000;
        }
      }
      if (memberData.cooldowns.message) {
        memberData.balance += 5;
        memberData.messageCount += 1;
        memberData.xp += Math.round((Math.random() + 1) * 5);
        memberData.cooldowns.message = Date.now() + 60000;
      }
      memberData.markModified('cooldowns');
      await memberData.save((err) => {
        if (err) { console.log('error saving memberData in message.js'); }
      });
    } catch (err) {
      console.error(err);
    }
  }
};
