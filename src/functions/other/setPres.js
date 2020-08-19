async function setPres(client, dbl) {
  client.user.setPresence({
    status: 'online',
    activity: {
      name: `${client.commandPrefix}help on  ${client.guilds.cache.size} servers | mikebot.xyz`,
      type: 'LISTENING',
    },
  }).catch(console.error);
  if (dbl && process.env.IN_PRODUCTION === 'production') { client.logger.warn('Sending server count'); await dbl.postStats(client.guilds.cache.size).catch(console.error); }
}
module.exports = setPres;
