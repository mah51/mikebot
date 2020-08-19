const admin = require('firebase-admin');
const serviceAccount = require('../../assets/firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
async function setPres(client, dbl) {
  let memberCount = 0;
  let guildCount = 0;
  const guildArray = client.guilds.cache.map((guild) => {
    guildCount += 1;
    if (guild.memberCount < 90000) {
      memberCount += guild.memberCount;
    }
    return { name: guild.name, id: guild.id };
  });
  const cmdCount = client.registry.commands
    .filter((command) => !command.ownerOnly && !command.hidden).size;
  if (process.env.IN_PRODUCTION === 'production') {
    db.collection('test').doc('testid').set({
      commands: cmdCount,
      guilds: guildCount,
      guildList: guildArray,
      members: memberCount,
    }).then(() => {
      client.logger.info(`Sent info to database:${cmdCount}, ${guildCount}, ${memberCount}`);
    })
      .catch((err) => client.logger.error(`Firebase error: ${err}`));
  }
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
