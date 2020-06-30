const chalk = require('chalk');
const fs = require('fs');
const checkUnmutes = require('../commandFunctions/intervalChecks');
const setPres = require('../setPres');

const descriptions = {
  'owner-only': 'Commands for Big Bois only',
  patterns: 'Pattern commands called via regex.',
  'join-sound': 'Set a youtube clip to play when joining a channel.',
  fun: 'Go on, have a bit of fun. (I recommend .bee)',
  'gamer-btw': 'Are you gamer enough?',
  music: 'Get groovy in a voice channel.',
  reddit: 'Search some interesting subreddits',
  lookups: 'Get some cool info from the interwebs',
  moderation: 'Moderation station, sort your server out.',
  text: 'Manipulate text like a chad.',
  info: 'Get info on everything in the server.',
  'server-tools': 'You\'d be a tool not to use these tools...',
  currency: 'Commands for currency',
  util: 'Utility commands (bit boring)',
  misc: 'A bunch of random commands.',
};

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    this.client.registry.groups.forEach((group) => {
      // eslint-disable-next-line no-param-reassign
      group.description = descriptions[group.id];
    });
    this.client.setting.start_time = Date.now();

    checkUnmutes(this.client);
    /*    this.client.guilds.cache.sort((a, b) => a.memberCount + b.memberCount).forEach((guild) => {
      this.client.logger.silly(`${chalk.cyan.bold(guild.memberCount)} members: ${chalk.magenta.bold(guild.name)} - ${chalk.blueBright.bold(guild.id)}`);
    }); */

    console.log(chalk.cyanBright(await fs.readFileSync('./boot.txt', 'utf-8')));
    this.client.logger.info(`Logged in as ${chalk.magenta.bold(`${this.client.user.username}#`)}${chalk.magenta.bold(this.client.user.discriminator)}\nWatching over ${chalk.blueBright.bold(this.client.guilds.cache.size)} guilds.`);
    // Setting bot presence
    this.client.user.setPresence({
      status: 'dnd',
      activity: {
        name: 'Just restarted xd',
        type: 'LISTENING',
      },
    }).catch(console.error);
    if (process.env.IN_PRODUCTION === 'production') {
      setTimeout(async () => {
        await setPres(this.client, this.client.dbl);
        await setInterval(async () => {
          await setPres(this.client, this.client.dbl);
        }, 1800000);
      }, 60000);
    }
  }
};
