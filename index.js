const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const DBL = require('dblapi.js');
const mongoose = require('mongoose');
const util = require('util');
const chalk = require('chalk');

const readdir = util.promisify(fs.readdir);
const CommandoClient = require('./structures/client');
const commandRun = require('./functions/commandFunctions/commandRun');
const MongoDBProvider = require('./functions/mongo-provider.js');

// Initialise client
const client = new CommandoClient({
  commandPrefix: '.',
  owner: '143699512790089729',
  invite: 'https://discord.gg/UmXUUaA',
  disableEveryone: true,
  unknownCommandResponse: false,
});

if (process.env.DBL_TOKEN) {
  client.dbl = new DBL(process.env.DBL_TOKEN, client);
  client.dbl.on('posted', () => {
    client.logger.info('Server count posted!');
  });
  client.dbl.on('error', (e) => {
    client.logger.error(`DBL ERROR ${e}`);
  });
}
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
// Bot login confirmation
const init = async () => {
  const evtFiles = await readdir('./functions/handlers').catch(console.error);
  const loadedFiles = evtFiles.map((file) => {
    const eventName = file.split('.')[0];
    // eslint-disable-next-line global-require
    const event = new (require(`./functions/handlers/${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./functions/handlers/${file}`)];
    return eventName;
  });
  client.logger.info(`Loaded ${chalk.bold(loadedFiles.join(', '))} events.`);
};
init().catch(console.error);

client.on('commandRun', (command, promise, message, args, fromPattern, result) => {
  commandRun(command, promise, message, args, fromPattern, result);
});
client.on('disconnect', (event) => {
  client.logger.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
  process.exit(0);
});
process.on('uncaughtException', (err, origin) => {
  client.logger.error(`Caught Exception:${err}:${err.stack} Exception origin: ${origin}`);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => reason && client.logger.error(`Unhandled Rejection: ${promise} reason: ${reason.message} ${reason.stack} ${reason}`));

client.on('error', (err) => client.logger.error(err.stack));

client.on('warn', (warn) => client.logger.warn(warn));

client.on('commandRun', (command) => {
  if (command.uses === undefined) return;
  // eslint-disable-next-line no-param-reassign
  command.uses += 1;
});

client.on('commandError', (command, err) => {
  client.logger.error(`[COMMAND:${command.name}]\n${err.stack}`);
});

// Register groups with commando
client.registry.registerGroups([
  ['owner-only', 'Owner Only 🤑', false, 'These commands are for big bois only.'],
  ['patterns', 'Pattern 🤨'],
  ['join-sound', 'Join Sounds 🔊'],
  ['fun', 'Fun 😆'],
  ['gamer-btw', 'Gamer 🎮'],
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
