module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(cmd, promise, msg, args, fromPattern, result) {
    if (cmd.uses !== undefined) {
      cmd.uses += 1;
    }
    if (!msg.author.bot) {
      if (msg.guild) {
        if (msg.client.provider.get(msg.guild.id, 'grp-currency') !== false) {
          const memberData = await msg.client.findMember({ id: msg.author.id, guildID: msg.guild.id }, false);
          if (!memberData.cooldowns.commands) {
            memberData.cooldowns.commands = 0;
          }
          if (memberData.cooldowns.commands < Date.now()) {
            memberData.balance += Math.ceil(Math.random() * 7);
            memberData.xp += Math.round((Math.random() + 1) * 5);
            memberData.cooldowns.commands = Date.now() + 60000;
            memberData.markModified('cooldowns.commands');
            await memberData.save();
          }
        }
      }
    }
    if (!msg.guild) { return; }
    const deleteSettings = msg.client.provider.get(msg.guild.id, 'deleteSettings');
    if (!deleteSettings) { return; }
    if (!msg) { return; }
    if (result && result.prompts) {
      result.prompts.forEach((prompt) => {
        prompt.delete().catch(console.error);
      });
    }
    if (result && result.answers) {
      result.answers.forEach((answer) => {
        answer.delete().catch(console.error);
      });
    }
  }
};
