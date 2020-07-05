module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(cmd, promise, msg, args, fromPattern, result) {
    try {
      if (process.env.DEBUG === 'on') console.log(`Running cmd: ${cmd.name}`);
      if (cmd.uses !== undefined) {
        cmd.uses += 1;
      }
      if (!msg.guild) {
        return;
      }
      const deleteSettings = msg.client.provider.get(msg.guild.id, 'deleteSettings');
      if (!deleteSettings) {
        return;
      }
      if (!msg) {
        return;
      }
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
    } catch (err) {
      console.error(err);
    }
  }
};
