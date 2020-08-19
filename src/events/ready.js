const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const intervalChecks = require('../functions/IntervalChecks/intervalChecks');
const setPres = require('../functions/other/setPres');
const { MainRoute } = require('../functions/other/express');

const descriptions = {
  'owner-only': 'Commands for Big Bois only',
  patterns: 'Pattern commands called via regex.',
  'join-sound': 'Set a youtube clip to play when joining a channel.',
  fun: 'Go on, have a bit of fun. (I recommend .bee)',
  stats: 'Compare who has the better K/D.',
  music: 'Get groovy in a voice channel.',
  games: 'Play some fun games with your friends or alone!',
  reddit: 'Search some interesting subreddits',
  lookups: 'Get some cool info from the interwebs',
  moderation: 'Moderation station, sort your server out.',
  text: 'Manipulate text like a chad.',
  info: 'Get info on everything in the server.',
  'server-tools': 'You\'d be a tool not to use these tools...',
  currency: 'Using commands and sending messages → profit!',
  util: 'Utility commands (bit boring)',
  misc: 'A bunch of random commands.',
  vote: 'Commands for legends that have voted for the bot on [Top.gg](https://top.gg/bot/698459684205494353)',
};

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    console.log(chalk.cyanBright(await fs.readFileSync(path.join(__dirname, '../util/boot.txt'), 'utf-8')));
    this.client.registry.groups.forEach((group) => {
      // eslint-disable-next-line no-param-reassign
      group.description = descriptions[group.id];
    });
    this.client.setting.start_time = Date.now();

    intervalChecks(this.client);
    this.client.logger.info(`Logged in as ${chalk.magenta.bold(`${this.client.user.username}#`)}${chalk.magenta.bold(this.client.user.discriminator)}\nWatching over ${chalk.blueBright.bold(this.client.guilds.cache.size)} guilds.`);
    // Setting bot presence
    const webHook = new MainRoute(this.client);
    webHook.init();
    this.client.user.setPresence({
      status: 'dnd',
      activity: {
        name: 'Just restarted xd',
        type: 'LISTENING',
      },
    }).catch(console.error);
    setTimeout(async () => {
      await setPres(this.client, this.client.dbl);
      await setInterval(async () => {
        await setPres(this.client, this.client.dbl);
      }, 1800000);
    }, 60000);
  }
};
