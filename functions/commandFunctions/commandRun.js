module.exports = (command, promise, message, args, fromPattern, result) => {
  if (!message.guild) { return; }
  const deleteSettings = message.client.provider.get(message.guild.id, 'deleteSettings');
  if (!deleteSettings) { return; }
  if (!message) { return; }
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
};
