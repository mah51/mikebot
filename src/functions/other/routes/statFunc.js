module.exports = (req, res, client) => {
  const guildCount = client.guilds.cache.size;
  const memberCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
  const commandCount = client.registry.commands.filter((command) => !command.ownerOnly && !command.hidden).size;

  res.status(200).json({
    guildCount,
    memberCount,
    commandCount,
  });
};
