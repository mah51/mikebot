const R6StatsAPI = require('r6statsapi').default;

const API = new R6StatsAPI('8b5f5a47-f686-4a78-b566-6f7dafe2b078');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class r6StatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'r6-stats',
      aliases: [
        'r6',
      ],
      group: 'gamer-btw',
      memberName: 'r6-stats',
      description: 'Returns r6 user stats',
      details: '',
      examples: [
        'r6-stats <username> <platform> [type] [other inputs eg. specific operator]',
        'r6-stats Mikerophone. pc operator twitch',
        'r6-stats Mikerophone. pc operator',
        'r6-stats Mikerophone. pc season void_edge',
        'r6-stats Mikerophone. pc',
      ],
      args: [
        {
          key: 'username',
          label: 'username',
          prompt: 'What is the user\'s username?',
          type: 'string',
        },
        {
          key: 'platform',
          label: 'platform',
          prompt: 'What platform is the user on? User pc, xbox, ps',
          type: 'string',
          error: 'That string was not valid. Valid inputs include pc, xbox, ps.',
          validate: (query) => ['pc', 'xbox', 'ps'].includes(query.toLowerCase()),
        },
        {
          key: 'type',
          label: 'type',
          prompt: 'What stats would you like to see? choose from general, weapon, season, operator. If you do not provide anything here general stats will be returned',
          type: 'string',
          default: '',
          infinite: true,
        },
      ],
      guildOnly: false,
      throttling: {
        error: 'Due to API throttling you can only use this command once every 10 seconds, in the meantime look at this cat 🐈',
        usages: 1,
        duration: 10,
      },
    });
  }

  async run(msg, { username, platform, type }, fromPattern, something) {
    if (type[0]) {
      type[0] = type[0].toLowerCase();
    }
    platform = platform.toLowerCase();

    // GENERAL STATS
    if (type === '' || type[0] === 'general') {
      const data = await API.getGenericStats(username, platform);
      if (data.status === 'error') { return msg.reply(`There was an error, that user probably doesn't exist: ${data.error}`); }
      const { general } = data.stats;
      const generalEmbed = new MessageEmbed()
        .setFooter(this.client.setting.footer)
        .setColor(this.client.setting.colour)
        .setTimestamp()
        .setTitle(`Showing general stats for ${data.username}`)
        .setThumbnail(data.avatar_url_146 ? data.avatar_url_146 : msg.author.avatarURL({ size: 128 }))
        .setDescription(`This information was last updated ${moment(data.last_updated).format('LLLL')}`)
        .addField('Info', `Level: ${data.progression.level}\nPlaytime: ${Math.round(moment.duration(general.playtime, 'seconds').asHours() * 100) / 100} Hours (${Math.round(moment.duration(general.playtime, 'seconds').asDays())} Days)\nTotal Games: ${general.games_played}`, true)
        .addField('\u200b', '\u200b', true)
        .addField('Kills/Deaths', `Kills: ${general.kills} (${general.assists} assists)\nDeaths: ${general.deaths}\nK/D: ${general.kd}`, true)
        .addField('Wins/Losses', `Wins: ${general.wins}\nLosses: ${general.losses}\nW/L: ${general.wl}`, true)
        .addField('\u200b', '\u200b', true)
        .addField('Accuracy', `Bullets Fired: ${general.bullets_fired}\nBullets Hit: ${general.bullets_hit}\nAccuracy: ${Math.round((general.bullets_hit / general.bullets_fired) * 10000) / 100}`, true)
        .addField('Kill info', `Blind Kills: ${general.blind_kills}\nPenetration Kills: ${general.penetration_kills}\nMelee Kills: ${general.melee_kills}`, true)
        .addField('\u200b', '\u200b', true)
        .addField('Death stats', `DBNOs: ${general.dbnos}\nRevives:${general.revives}\nSuicides: ${general.suicides}`, true)
        .addField('General stats', `Barricades Deployed: ${general.barricades_deployed}\nReinforcements Deployed: ${general.reinforcements_deployed}\nGadgets Destroyed: ${general.gadgets_destroyed}`, true);
      return msg.reply(generalEmbed).catch(console.error);
    }
    // WEAPON STATS
    if (type[0] === 'weapon') {
      const data = await API.getWeaponStats(username, platform);
      if (data.status === 'error') { return msg.reply(`There was an error, that user probably doesn't exist: ${data.error}`); }
      if (data.weapons.length === 0) { return msg.reply('No data was found for that user').catch(console.error); }
      const weaponEmbed = new MessageEmbed()
        .setFooter(this.client.setting.footer)
        .setColor(this.client.setting.colour)
        .setTimestamp()
        .setTitle(`Top 5 weapons for ${data.username}`)
        .setThumbnail(data.avatar_url_146 ? data.avatar_url_146 : msg.author.avatarURL({ size: 128 }));
      const weapons = data.weapons.sort((a, b) => {
        if (a.times_chosen > b.times_chosen) {
          return -1;
        } if (a.times_chosen < b.times_chosen) {
          return 1;
        }

        return 0;
      }).filter((a) => a.category !== 'Handgun').slice(0, 5);
      weapons.forEach((weapon) => {
        weaponEmbed.addField(`${weapon.weapon} - ${weapon.category} (picked ${weapon.times_chosen} times)`, `Kills: ${weapon.kills}\nDeaths: ${weapon.deaths}\nK/D: ${weapon.kd}\nHS%: ${Math.round(weapon.headshot_percentage * 100) / 100} (total: ${weapon.headshots})`, false);
      });
      return msg.reply(weaponEmbed).catch(console.error);
    }
    // SEASON STATS
    if (type[0] === 'season') {
      const data = await API.getSesonalStats(username, platform);
      if (data.status === 'error') { return msg.reply(`There was an error, that user probably doesn't exist: ${data.error}`); }
      const seasonNames = Object.keys(data.seasons);
      if (type.length < 2) { return msg.reply(`To get a season stats you need to provide a season eg. r6-stats <user> <platform> season <seasonname>\n\nAvailable seasons: \`${seasonNames.join('`, `')}\``).catch(console.error); }
      const userseasonName = type[1].toLowerCase();
      const seasonData = data.seasons[userseasonName];
      if (!seasonData) { return msg.reply(`The season name you provided was not recognised...Use the following input r6-stats <user> <platform> season <seasonname>\n\nAvailable seasons: \`${seasonNames.join('`, `')}\``); }
      const seasonEmbed = new MessageEmbed()
        .setFooter(this.client.setting.footer)
        .setColor(this.client.setting.colour)
        .setTimestamp()
        .setAuthor(`${data.username}'s info for ${seasonData.name}`, data.avatar_url_146);
      const regions = Object.keys(seasonData.regions);
      const regionsdata = regions.map((region) => seasonData.regions[region][0]).sort((a, b) => {
        if (a.mmr > b.mmr) { return -1; }
        if (a.mmr < b.mmr) { return 1; }
        return 0;
      })[0];
      seasonEmbed
        .setDescription(`Season rank: ${regionsdata.rank_text} in ${regionsdata.region}`)
        .setThumbnail(regionsdata.rank_image)
        .addFields([
          { name: 'Season MMR', value: `Current: ${regionsdata.mmr}\nMax: ${regionsdata.max_mmr}\nLast match MMR: ${regionsdata.last_match_mmr_change}`, inline: true },
          { name: '\u200b', value: '\u200b', inline: true },
          { name: 'Win/Loss', value: `Wins: ${regionsdata.wins}\nLosses: ${regionsdata.losses}\nW/L: ${Math.round(regionsdata.wins / regionsdata.losses * 10) / 10}`, inline: true },
          { name: 'K/D', value: `Kills: ${regionsdata.kills}\nDeaths: ${regionsdata.deaths}\nK/D: ${Math.round(regionsdata.kills / regionsdata.deaths * 10) / 10}`, inline: true },
          { name: '\u200b', value: '\u200b', inline: true },
          { name: 'Season info', value: `Started: ${moment(seasonData.start_date).format('DD/MM/YY')} ${seasonData.end_date ? `Ended: ${moment(seasonData.end_date).format('DD/MM/YY')}` : ''}`, inline: true },
        ]);
      return msg.reply(seasonEmbed).catch(console.error);
    }
    // OPERATOR STATS
    if (type[0] === 'operator') {
      const data = await API.getOperatorStats(username, platform);
      if (data.status === 'error') { return msg.reply(`There was an error, that user probably doesn't exist: ${data.error}`); }
      if (type.length === 2) {
        const operator = data.operators.filter((operator) => operator.name.toLowerCase() === type[1].toLowerCase())[0];
        if (!operator) { return msg.reply(`That operator was not recognised!\nTry any of these: \`${data.operators.map((operator) => operator.name).join('`, `')}\``); }
        const operatorEmbed = new MessageEmbed()
          .setFooter(this.client.setting.footer)
          .setColor(this.client.setting.colour)
          .setTimestamp()
          .setTitle(`Operator stats for ${operator.role} ${operator.name} - ${operator.ctu}`)
          .setThumbnail(operator.badge_image)
          .setAuthor(data.username, data.avatar_url_146)
          .addField('Win/Loss', `Wins: ${operator.wins}\nLosses: ${operator.losses}\nW/L: ${Math.round(operator.wl * 10) / 10}`, true)
          .addField('Kill/Death', `Kills: ${operator.kills}\nDeaths: ${operator.deaths}\nK/D: ${Math.round(operator.kd * 10) / 10}`, true)
          .addField('Game Stats', `Headshots: ${operator.headshots}\nDBNOs: ${operator.dbnos}\nMelee kills: ${operator.melee_kills}`, true)
          .addField('Play stats', `Time: ${Math.round(moment.duration(operator.playtime, 's').asHours())}\nXP: ${operator.experience}\n`, true);

        operator.abilities.forEach((ability) => {
          operatorEmbed.addField(ability.ability, ability.value, true);
        });
        return msg.reply(operatorEmbed).catch(console.error);
      }

      if (type.length === 1) {
        const operators = data.operators.sort((a, b) => {
          if (a.playtime > b.playtime) { return -1; }
          if (a.playtime < b.playtime) { return 1; }
          return 0;
        }).slice(0, 5);
        const topOperators = new MessageEmbed()
          .setFooter(this.client.setting.footer)
          .setColor(this.client.setting.colour)
          .setTimestamp()
          .setThumbnail(data.avatar_url_146)
          .setDescription('For more information on a specific operator use r6-stats <username> <platform> operator <operator>')
          .setTitle(`Top 5 operators for ${data.username}`);
        operators.forEach((operator) => {
          topOperators.addField(`${operator.name} - ${operator.role}`, `Playtime: ${Math.round(moment.duration(operator.playtime, 's').asHours() * 100) / 100} hours\nKills: ${operator.kills}\nK/D: ${operator.kd}\nWins: ${operator.wins}\nW/L: ${operator.wl}`, false);
        });
        return msg.reply(topOperators).catch(console.error);
      }
    } else {
      return msg.reply('There was something wrong with the command input...Use help r6-stats to get more info on command usage.').catch(console.error);
    }
  }
};
