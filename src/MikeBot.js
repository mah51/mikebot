const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const DBL = require('dblapi.js');
const mongoose = require('mongoose');
const util = require('util');
const chalk = require('chalk');
const { Intents } = require('discord.js');

const readdir = util.promisify(fs.readdir);
const CommandoClient = require('./structures/client');
const MongoDBProvider = require('./functions/other/mongo-provider.js');

process.setMaxListeners(0);
// Initialise client
const client = new CommandoClient({
  commandPrefix: '.',
  owner: '143699512790089729',
  invite: 'https://discord.gg/UmXUUaA',
  disableEveryone: true,
  unknownCommandResponse: false,
  ws: { intents: Intents.NON_PRIVILEGED },
  messageCacheMaxSize: 100,

});

if (process.env.DBL_TOKEN) {
  client.dbl = new DBL(process.env.DBL_TOKEN);
  client.dbl.on('posted', () => {
    client.logger.info('Server count posted!');
  });
  client.dbl.on('error', (e) => {
    client.logger.error(`DBL ERROR ${e}`);
  });
  client.logger.info('Loaded DBL instance');
} else { client.logger.warn('DBL was not loaded: No token provided'); }
// Login to client
client.login(process.env.BOT_TOKEN).catch(console.error);

// Setting database provider
client
  .setProvider(
    MongoClient.connect(process.env.DB_CONNECTION, { useUnifiedTopology: true }).then((mongoClient) => new MongoDBProvider(mongoClient, 'Mike-Bot-Provider-Settings')),
  ).catch(console.error);

mongoose.connect(process.env.MONGOOSE_TOKEN, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  client.logger.info(chalk.bold('Connected to the Mongoose database.'));
}).catch((err) => {
  client.logger.error(`Unable to connect to the Mongodb database. Error:${err}`);
});
mongoose.connection.on('close', () => {
  mongoose.connection.removeAllListeners();
});
// Bot login confirmation
const init = async () => {
  const fileRoot = path.join(__dirname, './events/');
  const evtFiles = await readdir(fileRoot).catch(console.error);
  const loadedFiles = evtFiles.map((file) => {
    const eventName = file.split('.')[0];
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const event = new (require(`${fileRoot}${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`${fileRoot}${file}`)];
    return eventName;
  });
  client.logger.info(`Loaded ${chalk.bold(loadedFiles.join(', '))} events.`);
};
init().catch(console.error);

client.on('disconnect', (event) => {
  client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
  process.exit(0);
});
process.once('SIGINT', () => {
  process.exit(0);
});

process.on('SIGUSR1', () => {
  process.exit(0);
});

process.on('SIGUSR2', () => {
  process.exit(0);
});

process.on('uncaughtException', (err, origin) => {
  client.logger.error(`Caught Exception:${err}:${err.stack} Exception origin: ${origin}`);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => reason && client.logger.error(`Unhandled Rejection: ${promise} reason: ${reason.message} ${reason.stack} ${reason}`));

process.on('exit', () => {
  client.logger.warn('Goodbye! exiting...');
  try {
    if (client) {
      if (client.provider) client.provider.destroy();
      client.destroy();
    }
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
      mongoose.connection.removeAllListeners();
      if (mongoose.connection.readyState === 3 || mongoose.connection.readyState === 0) { client.logger.info('Disconnected from mongoose safely'); }
    }
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
});
client.on('error', (err) => client.logger.error(err.stack));

client.on('warn', (warn) => client.logger.warn(warn));

client.on('commandError', (command, err) => {
  client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`);
});

// Register groups with commando
client.registry.registerGroups([
  ['owner-only', 'Owner Only 🤑', false, 'These commands are for big bois only.'],
  ['patterns', 'Pattern 🤨'],
  ['join-sound', 'Join Sounds 🔊'],
  ['fun', 'Fun 😆'],
  ['games', 'Games 🎮'],
  ['stats', 'Game Stats 📈'],
  ['music', 'Music 🎵'],
  ['reddit', 'Reddit 💀'],
  ['lookups', 'API Searches 🔎'],
  ['moderation', 'Moderation ⚔️'],
  ['text', 'Text Manipulation 📜'],
  ['info', 'Info ❓'],
  ['server-tools', 'Server Tools 🛠️'],
  ['currency', 'Currency 💸'],
  ['util', 'Utility 💡'],
  ['misc', 'Misc. 🙃'],
])
  .registerDefaultTypes()
  .registerCommandsIn(path.join(__dirname, 'commands'));
