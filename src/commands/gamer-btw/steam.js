const axios = require('axios');
const moment = require('moment');
const Command = require('../../structures/commands');

module.exports = class SteamCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'steam',
      aliases: [

      ],
      group: 'stats',
      memberName: 'steam',
      fullName: 'Steam Search',
      description: 'Searches for a steam user.',
      details: '',
      examples: [

      ],
      args: [
        {
          key: 'user',
          label: 'user',
          prompt: 'Which user would you like to search for?',
          type: 'string',
        },
      ],
      guildOnly: false,
    });
  }

  async run(msg, args, fromPattern, result) {
    let { user } = args;
    try {
      let steamid;
      let id;
      let profile;
      let bans;
      let games;
      let steamlvl;
      let description;

      // Vanity URL checker
      if (/^\d+$/.test(user)) steamid = user;
      else if (user.startsWith('https://steamcommunity.com/id/')) {
        user = user.join(' ')
          .substring('https://steamcommunity.com/id/'.length, user.join(' ').length);
      }

      if (!steamid) {
        id = await axios.get(
          'http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/'
          + `?key=${process.env.STEAM_KEY}&vanityurl=${encodeURIComponent(user)}`,
        ).then((data) => data.data);

        if (!id || id.response.success !== 1) {
          return this.makeError(msg, 'Account not found');
        }
        steamid = id.response.steamid;
      }

      // Gets summary info
      const steamsg = await msg.say(await this.client.embeds.create().setDescription('`🎮` Searching for data').setColor(this.client.embeds.colour('warn')));
      profile = await axios.get(
        'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/'
        + `?key=${process.env.STEAM_KEY}&steamids=${steamid}`,
      ).then((data) => data.data);
      // eslint-disable-next-line prefer-destructuring
      profile = profile.response.players[0];

      // Gets ban info
      bans = await axios.get(
        'http://api.steampowered.com/ISteamUser/GetPlayerBans/v1/'
        + `?key=${process.env.STEAM_KEY}&steamids=${steamid}`,
      ).then((data) => data.data);
      // eslint-disable-next-line prefer-destructuring
      bans = bans.players[0];

      // Gets owned games
      games = await axios.get(
        'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/'
        + `?steamid=${steamid}&include_appinfo=1&include_played_free_games=1&key=${process.env.STEAM_KEY}`,
      ).then((data) => data.data);
      games = games.response;

      // Gets steam level
      steamlvl = await axios.get(
        'https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/'
        + `?steamid=${steamid}&key=${process.env.STEAM_KEY}`,
      ).then((data) => data.data);
      steamlvl = steamlvl.response.player_level;

      // Gets bio (might break in the future)
      description = await axios.get(`http://steamcommunity.com/profiles/${steamid}`).then((data) => data.data);

      description = /<div class="profile_summary">[\s\n]{0,}([\w\d\s;_\-,.]{0,512})<\/div>/.exec(description);
      // eslint-disable-next-line prefer-destructuring
      if (description) description = description[1];
      if (!description || description === 'No information given.') description = null;
      if (description && description.length > 256) description = `${description.substring(0, 256)}...`;
      if (!profile || !bans || !games) return this.makeError(msg, 'Account not found.');

      // Formats statuses
      if (profile.personastate === 0) profile.personastate = 'Offline/Invisible';
      if (profile.personastate === 1) profile.personastate = 'Online';
      if (profile.personastate === 2) profile.personastate = 'Busy';
      if (profile.personastate === 3) profile.personastate = 'Away';
      if (profile.personastate === 4) profile.personastate = 'Snooze';
      if (profile.personastate === 5) profile.personastate = 'Looking to trade';
      if (profile.personastate === 6) profile.personastate = 'Looking to play';

      const fieldsConstruct = [{
        name: 'ID',
        value: profile.steamid,
        inline: true,
      }, {
        name: 'Display Name',
        value: profile.personaname,
        inline: true,
      }, {
        name: 'Visibility',
        value: profile.personastate || 'Private',
        inline: true,
      }, {
        name: 'Playing',
        value: `${profile.gameid ? games.games.find((game) => game.appid === profile.gameid).name : 'Not playing anything'}`,
        inline: true,
      }, {
        name: 'Games Owned',
        value: games.game_count || 'Private',
        inline: true,
      }, {
        name: 'Level',
        value: steamlvl || '0',
        inline: true,
      }, {
        name: 'Creation Date',
        value: profile.timecreated ? moment(profile.timecreated * 1000).format('DD MMM YYYY') : 'Unknown',
        inline: true,
      }, {
        name: 'Last Online',
        value: profile.lastlogoff !== undefined ? `${moment.duration((Date.now() - (profile.lastlogoff * 1000)) * -1).humanize(true)}` : 'Unknown',
        inline: true,
      }];

      if (profile.loccountrycode) {
        fieldsConstruct.push({
          name: 'Country',
          value: `:flag_${profile.loccountrycode.toLowerCase()}:` || 'Unknown',
          inline: true,
        });
      }

      if (profile.realname) {
        fieldsConstruct.push({
          name: 'Real Name',
          value: profile.realname,
          inline: true,
        });
      }

      let banstring = '';
      if (bans.NumberOfVACBans > 0 || bans.NumberOfGameBans > 0 || bans.EconomyBan !== 'none') {
        if (bans.NumberOfVACBans > 0) banstring += `\`✅\` ${bans.NumberOfVACBans} VAC Ban${bans.NumberOfVACBans > 1 ? 's' : ''}\n`;
        else banstring += '`❌` 0 VAC Bans\n';
        if (bans.NumberOfGameBans > 0) banstring += `\`✅\` ${bans.NumberOfGameBans} Game Ban${bans.NumberOfGameBans > 1 ? 's' : ''}\n`;
        else banstring += '`❌` 0 Game Bans\n';
        if (bans.EconomyBan !== 'none') banstring += `\`✅\` Trade ban status: ${bans.EconomyBan}\n`;
        else banstring += '`❌` Not trade banned\n';
      }

      if (banstring.length) {
        fieldsConstruct.push({
          name: 'Ban Status',
          value: banstring,
          inline: false,
        });
      }

      return steamsg.edit(await this.client.embeds.create()
        .setDescription(description)
        .addFields(fieldsConstruct)
        .setAuthor(profile.personaname, profile.avatarfull, `https://steamcommunity.com/profiles/${profile.steamid}`)
        .setThumbnail(profile.avatarfull)
        .setFooter(`Requested by ${msg.member.displayName}`, msg.author.displayAvatarURL({ size: 256 })));
    } catch (err) {
      console.error(err);
      await this.onError(err, msg, args, fromPattern, result);
    }
  }
};
