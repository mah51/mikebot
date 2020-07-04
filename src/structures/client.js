const { CommandoClient } = require('discord.js-commando');
const winston = require('winston');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const { Collection } = require('discord.js');
const memberModel = require('./member');
const guildModel = require('./guild');
const errorModel = require('./logger');
const userModel = require('./users');
const MusicClient = require('./music');

const levels = {
  levels: {
    error: 0,
    warn: 1,
    debug: 2,
    info: 3,
    music: 4,
    silly: 5,
  },
  colours: {
    error: 'red',
    warn: 'yellow',
    debug: 'blue',
    info: 'green',
    music: 'cyan',
    silly: 'cyan',
  },
};

class MikeBotClient extends CommandoClient {
  constructor(options) {
    super(options);
    this.guildsData = guildModel;
    this.membersData = memberModel;
    this.usersData = userModel;
    this.errorsData = errorModel;
    this.databaseCache = {};
    this.databaseCache.guilds = new Collection();
    this.databaseCache.members = new Collection();
    this.databaseCache.users = new Collection();

    this.steals = new Collection();
    this.timers = new Collection();
    this.games = new Collection();

    this.setting = {
      colour: '#59FF92',
      successcolour: '#4BF08C',
      errorcolour: '#FF5251',
      footer: 'Powered by MikeBot 😎',
      start_time: Date.now(),
    };

    // eslint-disable-next-line global-require
    this.version = require('../../package.json').version;
    // eslint-disable-next-line global-require
    this.embeds = new (require('../util/embeds'))(this);
    this.spotify = new Spotify({
      id: process.env.SPOTIFY_ID,
      secret: process.env.SPOTIFY_SECRET,
    });
    this.music = new MusicClient(this, {
      apiKey: process.env.YOUTUBE_KEY,
      defVolume: 50,
      bitRate: 25000,
      maxHistory: 50,
      maxQueue: 100,
      searchFilters: ['cover', 'live', 'remix', 'mix', 'parody', 'hour', 'extended', 'trailer'],
      color: this.setting.colour,
      logger: this.musicLog,
    });

    winston.addColors(levels.colours);
    this.musicLog = winston.createLogger({
      levels: levels.levels,
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf((msg) => winston.format.colorize().colorize(msg.level, `${moment(msg.timestamp).format('HH:mm:ss - DD/MM')} | ${msg.level}: ${msg.message}`)),
      ),
      transports: [
        new winston.transports.File({ filename: './musicLogs/musicCommands.log', maxsize: 10000 }),
      ],
    });
    winston.addColors(levels.colours);
    this.logger = winston.createLogger({
      levels: levels.levels,
      level: 'silly',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf((msg) => winston.format.colorize().colorize(msg.level, `${moment(msg.timestamp).format('HH:mm:ss - DD/MM')} | ${msg.level}: ${msg.message}`)),
      ),
      transports: [
        new winston.transports.Console(),
      ],
    });
  }

  async findGuild({ id: guildID }, isLean = false) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (this.databaseCache.guilds.get(guildID)) {
        resolve(this.databaseCache.guilds.get(guildID));
      } else {
        let guildData = (isLean ? await this.guildsData.findOne({ id: guildID }).populate('members').lean() : await this.guildsData.findOne({ id: guildID }).populate('members'));
        if (guildData) {
          resolve(guildData);
        } else {
          // eslint-disable-next-line new-cap
          guildData = new this.guildsData({ id: guildID });
          await guildData.save();
          resolve(guildData);
        }
        !isLean ? this.databaseCache.guilds.set(guildID, guildData) : '';
      }
    });
  }

  async findMember({ id: memberID, guildID }, isLean = false) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (this.databaseCache.members.get(`${memberID}${guildID}`)) {
        resolve(this.databaseCache.members.get(`${memberID}${guildID}`));
      } else {
        let memberData = (isLean ? await this.membersData.findOne({ id: memberID, guildID }).lean() : await this.membersData.findOne({ id: memberID, guildID }));
        if (memberData) {
          resolve(memberData);
        } else {
          // eslint-disable-next-line new-cap
          memberData = new this.membersData({ id: memberID, guildID });
          await memberData.save();
          const guild = await this.findGuild({ id: guildID });
          if (guild) {
            // eslint-disable-next-line no-underscore-dangle
            guild.members.push(memberData._id);
            await guild.save();
          }
          resolve((isLean ? memberData.toJSON() : memberData));
        }
        this.databaseCache.members.set(`${memberID}${guildID}`, memberData);
      }
    });
  }

  async findUser({ id: userID }, isLean) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      if (this.databaseCache.users.get(userID)) {
        resolve(this.databaseCache.users.get(userID));
      } else {
        let userData = (isLean ? await this.usersData.findOne({ id: userID }).lean() : await this.usersData.findOne({ id: userID }));
        if (userData) {
          resolve(userData);
        } else {
          // eslint-disable-next-line new-cap
          userData = new this.usersData({ id: userID });
          await userData.save();
          resolve((isLean ? userData.toJSON() : userData));
        }
        this.databaseCache.users.set(userID, userData);
      }
    });
  }
}
module.exports = MikeBotClient;
